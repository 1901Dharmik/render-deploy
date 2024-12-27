// controllers/orderController.js
const Order = require('../models/sajivanModel');

// @desc Create a new order
// @route POST /api/orders
const sajivancreateOrder = async (req, res) => {
  try {
    const {
      prepaid, status, source, type, date, agent,
      customerName, customerNumber, alternateNumber,
      price, disease, gasofinePowder, refreshPowder,
      iceRosePowder, amrutamTablet, lexoliteTablet,
      constirelexPowder, courierName, trackingId
    } = req.body;

    const order = new Order({
      prepaid, status, source, type, date, agent,
      customerName, customerNumber, alternateNumber,
      price, disease, gasofinePowder, refreshPowder,
      iceRosePowder, amrutamTablet, lexoliteTablet,
      constirelexPowder, courierName, trackingId
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Get all orders
// @route GET /api/orders
// const getAllOrders = async (req, res) => {
//   try {
//     const { search, page = 1, limit = 10 } = req.query;

//     // Build the query object
//     let query = {};
//     if (search) {
//       query = {
//         $or: [
//           { customerNumber: { $regex: search, $options: 'i' } },
//           { alternateNumber: { $regex: search, $options: 'i' } },
//           { customerName: { $regex: search, $options: 'i' } },
//           { agent: { $regex: search, $options: 'i' } }
//         ]
//       };
//     }

//     // Calculate skip value for pagination
//     const skip = (page - 1) * limit;

//     // Find orders based on query, with pagination
//     const orders = await Order.find(query)
//       .limit(parseInt(limit))
//       .skip(skip)
//       .sort({ date: -1 }); // Sort by date, newest first

//     // Get total count of matching documents
//     const totalOrders = await Order.countDocuments(query);

//     res.json({
//       orders,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(totalOrders / limit),
//       totalOrders
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const getAllOrders = async (req, res) => {
  try {
    const { 
      customerNumber,
      customerName,
      page = 1, 
      limit = 10 
    } = req.query;

    // Build the query object based on provided search parameters
    let query = {};
    
    // Add customerNumber to query if provided
    if (customerNumber) {
      query.customerNumber = { 
        $regex: customerNumber, 
        $options: 'i' 
      };
    }

    // Add customerName to query if provided
    if (customerName) {
      query.customerName = { 
        $regex: customerName, 
        $options: 'i' 
      };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Find orders based on query, with pagination
    const orders = await Order.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      // .sort({ date: -1 }); // Sort by date, newest first

    // Get total count of matching documents
    const totalOrders = await Order.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalOrders,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch orders',
      error: error.message 
    });
  }
};
// @desc Get a single order by ID
// @route GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update an order
// @route PUT /api/orders/:id
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Delete an order
// @route DELETE /api/orders/:id
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (order) {
      res.json({ message: 'Order deleted successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get analytics data for orders
// @route GET /api/orders/analytics
const sajivanAnalytics = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $match: {
          date: { $ne: "" }, // Only consider orders with non-empty dates
          price: { $ne: null, $ne: "" }, // Exclude orders with null or empty price values
        },
      },
      {
        $project: {
          price: {
            $convert: {
              input: "$price",
              to: "double",
              onError: 0, // Default to 0 if conversion fails
              onNull: 0,  // Default to 0 if null
            },
          },
          year: { $year: { $dateFromString: { dateString: "$date", format: "%d-%m-%Y" } } },
          month: { $month: { $dateFromString: { dateString: "$date", format: "%d-%m-%Y" } } },
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$price" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalOrders: 1,
          totalRevenue: 1,
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Aggregation Error", error: err.message });
  }
};

module.exports = {
  sajivancreateOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  sajivanAnalytics,
};
