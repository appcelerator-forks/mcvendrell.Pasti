exports.createNavigatorGroup = function(mainWindow) {

    var me = {};

    if (OS_IOS) {   
        // Create the navigator, create a window for the navigator and add the navigator to the window.
        var navGroup = Titanium.UI.iOS.createNavigationWindow({window: mainWindow});
        navGroup.open();

		// Open the window inside the navGroup
        me.open = function(win) {
            navGroup.openWindow(win);
        };

        // Close the window on this nav
        me.close = function(win) {
            navGroup.closeWindow(win);
        };

		// Add a left button
        me.setLeftButton = function(win, button) {
            win.setLeftNavButton(button);
        };

		// Add a right button
        me.setRightButton = function(win, button) {
            win.setRightNavButton(button);
        };

    } else {
    	// For Android systems we must build our own system. We will have a stack var (LIFO)
    	// that will hold all the navViews we are building
	    var navViews = []; // A stack of navigation bars
	    var navView;  // Actual navView
	
		// Prepare a navView for possible use. This will be empty and ready to fill with
		// new objects, like label or buttons.
	    function pushNavBar() {
	        navView = Ti.UI.createView({
	            top: 0,
	            height: 44,
	            backgroundColor: '#BBB'
	        });
	        navViews.push(navView);
	    };
	    
		// Remove the prepared navView and clear the actual
	    function popNavBar() {
	        navViews.pop();
	        navView = navViews[navViews.length - 1];
	        // Remove ALL previous objects we set in the actual window, to have it clear for the new ones.
	        navView.removeAllChildren();
	    };
	
		// Event to close by code the window on physical back button.
		// We need to do this way so we can remove the event on window close
		function closeWindowByBackButton(e) {
	        Ti.API.info("Closing by back button on: " + e.source.title);
			me.close(e.source);
		}

	    // Make sure we always have a navView available to prepare
	    // We need it because set left/right buttons is an action made BEFORE the
	    // creation of the window, so we need to set it
	    pushNavBar();
	
		// Open a new window, setting previously the navBar with its options
	    me.open = function(win) {
	    	// The title
	    	navView.add(Ti.UI.createLabel({
	            text: win.title,
	            font: {	fontFamily: "Arial", fontSize: 20 },
	            color: 'black'
	        }));
			
			// For second or more views, add a back button
	        if (navViews.length >= 2) {
	            var button = Ti.UI.createButton({
					// Do you want to simulate iOS nav back button behavior, having the name of the
					// previous window? Uncomment this line (and comment the next)
	                //title: '< ' + navViews[navViews.length - 2].winTitle
	                title: '<<'
	            });
	            me.setLeftButton(win, button);
	            
	            button.addEventListener('click', function() {
	                me.close(win);
	            });
	            
				// Add detection of physical back button for Android
				// We need to close manually the window to avoid the back button
				// to close all the program (because our controller is creating all
				// the new windows without especifying win.navBarHidden, in order to allow
				// the Android Activity to work properly)
				// NOTE: manually detecting the back button press overrides its behavior, so nothing happens
				win.addEventListener('android:back', closeWindowByBackButton);
	        }
	
			// Because the detection of physical back button for Android,
			// we need to remove the back detection when closing the window, or a bug
			// will make that the last back event detection will be still active in the main window
			// of the app, producing a non desired behavior (will not allow to close the app)
			win.addEventListener('close', function(e) {
				win.removeEventListener('android:back', closeWindowByBackButton);
			});

			// Save the actual title to immitate iOS behavior
			navView.winTitle = win.title;
	        win.add(navView);
	
			// Comment to have a lightweight Android window (no new Android activity in this case)
			// If you leave this uncommented, you must control manually the Android physical button
			// or it will close directly the window, instead going back
	        //win.navBarHidden = true;
	        
	        win.open();
	
			// Prepare a new navView for the next possible window
	        pushNavBar();
	    };
	
		// Close the actual window
	    me.close = function(win) {
	        if (navViews.length > 1) {
	        	// Remove the prepared navView and clear the actual
	            popNavBar();
	            // Close the window on this nav
	            win.close();
	        }
	    };
	
		// To add a left button
		// win var is never used here, but is for compatibility with the iOS code call
	    me.setLeftButton = function(win, button) {
	    	if (button.width <= 30 && button.height <= 30) {
	    		// Smaller special button, like info button
	            button.top = 8;
	            button.left = 8;
	            button.font = {	fontFamily: "monospace", fontSize: 14 };
	    	} else {
	            button.top = 5;
	            button.left = 5;
	        }
	        navView.add(button);
	    };
	 
		// To add a right button
		// win var is never used here, but is for compatibility with the iOS code call
	    me.setRightButton = function(win, button) {
	        button.top = 5;
	        button.right = 5;
	        navView.add(button);
	    };
    };

    return me;
};