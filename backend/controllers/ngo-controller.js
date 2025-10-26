const User = require('../models/usermodel');
const { Food } = require('../models/Foodmodel');
const Booking = require('../models/Bookingmodel')

const Foodlistings = async (req, res) => {
    try {
        console.log("Fetching available food listings...");
        const start = new Date();
        start.setUTCHours(0, 0, 0, 0);

        const end = new Date();
        end.setUTCHours(23, 59, 59, 999);

        console.log("Start Date UTC:", start.toISOString());
        console.log("End Date UTC:", end.toISOString());

        const foodAvailable = await Food.find({
            dateAdded: { $gte: start, $lt: end }
        });

        console.log("Filtered Data:", foodAvailable);

        const availableFood = foodAvailable.map(institute => ({
            instituteUsername: institute.institute_username,
            meals: institute.mealTypes.map(meal => ({
                type: meal.type,
                items: meal.items.filter(item => item.availability === 'YES')
            }))
        }));

        console.log("Available Food:", availableFood);

        res.status(200).json({ success: true, availableFood });
    } catch (error) {
        console.error("Error fetching food listings:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const bookFood = async (req, res, io, users) => {
  try {
    const { instituteUsername, mealType, foodItems, ngoUsername } = req.body;
    console.log("Received booking request:", req.body);

    // Validation
    if (!instituteUsername || !mealType || !foodItems || !ngoUsername) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!Array.isArray(foodItems) || foodItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "foodItems must be a non-empty array of { food_name, quantity }",
      });
    }

    // Validate each food item
    for (const item of foodItems) {
      if (!item.food_name || !item.quantity || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Each food item must have a name and valid quantity",
        });
      }
    }

    // Check if NGO already has a pending booking for the same institute and meal type
    const existingBooking = await Booking.findOne({
      ngoUsername,
      instituteUsername,
      mealType,
      status: "PENDING",
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending booking for this meal type",
      });
    }

    // Find the food listing for the institute and meal type
    const foodListing = await Food.findOne({
      institute_username: instituteUsername,
      "mealTypes.type": mealType,
    }).exec(); // Force promise resolution

    if (!foodListing) {
      return res.status(404).json({
        success: false,
        message: `No food listing found for institute ${instituteUsername}`,
      });
    }

    // Find the meal type inside the listing
    const mealTypeFound = foodListing.mealTypes.find(
      (m) => m.type === mealType
    );

    if (!mealTypeFound) {
      return res.status(404).json({
        success: false,
        message: `Meal type ${mealType} not found in institute's menu`,
      });
    }

    if (!mealTypeFound) {
      return res.status(404).json({
        success: false,
        message: `No ${mealType} items found`,
      });
    }

    let availableItems = [];
    let unavailableItems = [];

    // Check each requested food item against available menu items
    for (const requestedItem of foodItems) {
      const itemInMenu = mealTypeFound.items.find(
        (item) => item.food_name === requestedItem.food_name
      );

      if (!itemInMenu) {
        unavailableItems.push(requestedItem.food_name);
        continue;
      }

      if (
        itemInMenu.availability === "YES" &&
        itemInMenu.quantity >= requestedItem.quantity
      ) {
        availableItems.push({
          food_name: itemInMenu.food_name,
          quantity: requestedItem.quantity,
        });

        // Reserve the item immediately
        itemInMenu.availability = "RESERVED";
      } else {
        unavailableItems.push(requestedItem.food_name);
      }
    }

    // If no items are available, stop here
    if (availableItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All requested food items are unavailable",
        unavailableItems,
      });
    }

    // Save the updated food listing (marking reserved)
    foodListing.markModified("mealTypes");
    await foodListing.save();

    // Create a new booking record
    const newBooking = new Booking({
      instituteUsername,
      ngoUsername,
      mealType,
      foodItems: availableItems, // ✅ Stored as array
      status: "PENDING",
      requestedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes expiry
    });

    await newBooking.save();

    // Notify the institute via WebSocket
    if (users[instituteUsername]) {
      io.to(users[instituteUsername].socketId).emit("newBookingRequest", {
        requestId: newBooking._id,
        message: `New booking request from ${ngoUsername}`,
        ngoUsername,
        foodItems: availableItems,
        mealType,
        expiresAt: newBooking.expiresAt,
      });
    }

    // Expiry handler: auto-expire after 30 minutes if still pending
    setTimeout(async () => {
      try {
        const booking = await Booking.findById(newBooking._id);
        if (booking && booking.status === "PENDING") {
          booking.status = "EXPIRED";
          await booking.save();

          // Restore food availability
          const foodDoc = await Food.findOne({
            institute_username: instituteUsername,
          });

          if (foodDoc) {
            foodDoc.mealTypes.forEach((meal) => {
              if (meal.type === mealType) {
                meal.items.forEach((item) => {
                  if (
                    availableItems.some(
                      (ai) => ai.food_name === item.food_name
                    )
                  ) {
                    item.availability = "YES";
                  }
                });
              }
            });
            foodDoc.markModified("mealTypes");
            await foodDoc.save();
          }

          // Notify both parties about expiration
          if (users[ngoUsername]) {
            io.to(users[ngoUsername].socketId).emit("bookingExpired", {
              bookingId: newBooking._id,
              message: "Booking expired: No response from institute",
            });
          }
          if (users[instituteUsername]) {
            io.to(users[instituteUsername].socketId).emit("bookingExpired", {
              bookingId: newBooking._id,
              message: "Booking expired: Response time exceeded",
            });
          }
        }
      } catch (error) {
        console.error("Error in expiry handler:", error);
      }
    }, 30 * 60 * 1000);

    // ✅ Success Response
    res.status(200).json({
      success: true,
      message: "Food booked successfully and institute notified",
      bookingId: newBooking._id,
      expiresAt: newBooking.expiresAt,
      unavailableItems,
    });
  } catch (error) {
    console.error("Error booking food:", error);
    res.status(500).json({
      success: false,
      message: "Server error while booking food",
    });
  }
};

  


module.exports = { Foodlistings, bookFood };
