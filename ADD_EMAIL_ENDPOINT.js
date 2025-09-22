// Add this code to your backend/src/quick-server.js file after line 660 (after analytics endpoint)

// Email notification endpoint
app.post('/api/v1/send-email', authenticateToken, async (req, res) => {
  try {
    const { type, dependency, user } = req.body;
    
    if (!type || !dependency || !user) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: type, dependency, user'
      });
    }

    const result = await sendNotificationEmail(type, dependency, user);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send email',
        error: result.error
      });
    }
    
  } catch (error) {
    console.error('Email endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});
