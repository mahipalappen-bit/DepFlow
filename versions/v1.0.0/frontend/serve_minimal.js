const express = require('express');
const app = express();
const PORT = 3000;

const simpleHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Launch Button Test</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 2rem; }
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            align-items: center;
            justify-content: center;
        }
        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            max-width: 400px;
            width: 90%;
        }
        button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            margin: 0.5rem;
        }
        button:hover { background: #2563eb; }
        .input-group { margin: 1rem 0; }
        .input-group label { display: block; margin-bottom: 0.5rem; }
        .input-group input { 
            width: 100%; 
            padding: 0.75rem; 
            border: 1px solid #ccc; 
            border-radius: 4px;
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    <h1>🚀 Minimal Launch Application Test</h1>
    <p>This is a minimal test to verify the Launch Application button works.</p>
    
    <button id="launchBtn" onclick="openModal()">Launch Application</button>
    <button onclick="testAlert()">Test Alert</button>
    <button onclick="testConsole()">Test Console</button>
    
    <div id="loginModal" class="modal">
        <div class="modal-content">
            <h3>✅ Success! Launch Button Works!</h3>
            <p>The modal opened successfully.</p>
            
            <div class="input-group">
                <label for="email">Email:</label>
                <input type="email" id="email" placeholder="Enter email">
            </div>
            
            <div class="input-group">
                <label for="password">Password:</label>
                <input type="password" id="password" placeholder="Enter password">
            </div>
            
            <button onclick="closeModal()">Close Modal</button>
            <button onclick="testLogin()">Test Login</button>
        </div>
    </div>

    <div id="status" style="margin-top: 2rem; padding: 1rem; background: #f0f0f0; border-radius: 4px;">
        <h3>Status:</h3>
        <p id="statusText">Page loaded, waiting for button click...</p>
    </div>

    <script>
        console.log('🚀 MINIMAL TEST STARTING...');
        
        function updateStatus(message) {
            document.getElementById('statusText').textContent = message;
            console.log('STATUS:', message);
        }
        
        function openModal() {
            console.log('✅ LAUNCH BUTTON CLICKED!');
            updateStatus('Launch button clicked! Opening modal...');
            
            var modal = document.getElementById('loginModal');
            if (modal) {
                modal.style.display = 'flex';
                updateStatus('Modal opened successfully!');
                
                var email = document.getElementById('email');
                if (email) {
                    email.focus();
                    updateStatus('Modal opened and email field focused!');
                }
            } else {
                updateStatus('ERROR: Modal not found!');
                console.error('Modal element not found!');
            }
        }
        
        function closeModal() {
            console.log('Closing modal...');
            var modal = document.getElementById('loginModal');
            if (modal) {
                modal.style.display = 'none';
                updateStatus('Modal closed.');
            }
        }
        
        function testAlert() {
            alert('Alert works! JavaScript is functioning.');
            updateStatus('Alert test completed.');
        }
        
        function testConsole() {
            console.log('Console test message!');
            updateStatus('Console test completed - check browser console.');
        }
        
        function testLogin() {
            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;
            
            if (email && password) {
                updateStatus('Login test: Email=' + email + ', Password entered');
                alert('Login test successful!');
            } else {
                updateStatus('Login test: Please enter email and password');
            }
        }
        
        // Make functions globally available
        window.openModal = openModal;
        window.closeModal = closeModal;
        window.testAlert = testAlert;
        window.testConsole = testConsole;
        window.testLogin = testLogin;
        
        console.log('✅ All functions ready');
        updateStatus('All functions loaded and ready!');
        
        // Test on page load
        window.addEventListener('load', function() {
            console.log('Page fully loaded');
            updateStatus('Page fully loaded. Ready for testing!');
            
            var button = document.getElementById('launchBtn');
            console.log('Launch button found:', !!button);
            
            var modal = document.getElementById('loginModal');
            console.log('Modal element found:', !!modal);
            
            if (button && modal) {
                updateStatus('✅ Both button and modal found! Ready to test.');
            } else {
                updateStatus('❌ Missing elements!');
            }
        });
    </script>
</body>
</html>
`;

app.get('/', (req, res) => {
    res.send(simpleHTML);
});

app.listen(PORT, () => {
    console.log(`🚀 Minimal test server running at http://localhost:${PORT}`);
    console.log('📝 This is a minimal test to verify Launch Application functionality');
});


