/**
 * Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
    console.error('Error Details:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    const statusCode = err.status || 500;

    res.status(statusCode).json({
        success: false,
        error: {
            message: err.message || 'Internal Server Error',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        },
    });
};

/**
 * 404 Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        error: {
            message: 'Endpoint not found',
        }
    });
};
