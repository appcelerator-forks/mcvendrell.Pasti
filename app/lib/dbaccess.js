// Go out to the database and return the data
function getPills() {
    Ti.API.info('Inside getPills');

    // Our database: this copy the starting database from assets to Resources,
    // if it dont exists yet. If exists, only open it.
    var dbname = Alloy.Globals.dbname;
    var db = Titanium.Database.install('/data/' + dbname, dbname);
	
	// Get all the pills ordered
	var pills = db.execute('SELECT * FROM pills ORDER BY name');
	Titanium.API.info('ROW COUNT = ' + pills.getRowCount());

	// Save temporarily the data to a var	
	var data = [];
	while (pills.isValidRow()) {
		Titanium.API.info('ID: ' + pills.field(0) + ' NAME: ' + pills.fieldByName('name') + ' FIRST: ' + pills.fieldByName('first_take') + ' INT: ' + pills.fieldByName('interval'));
		
		// Simple way to add a row (only one text field)
		data.push(Ti.UI.createTableViewRow({title: pills.fieldByName('name')}));
		
		// Custom way to add a row
		// var row = Ti.UI.createTableViewRow({
			// backgroundColor:'transparent'
		// });

		// var labelName = Ti.UI.createLabel({
    		// color: '#576996',
    		// font: {fontFamily:'Arial', fontSize:18, fontWeight:'bold'},
		    // text: pills.fieldByName('name'),
    		// left:5
		// });
  		// row.add(labelName);
 		
		// var labelNum = Ti.UI.createLabel({
    		// color: '#00F',
		    // text: pills.fieldByName('interval'),
    		// left: 105
		// });
  		// row.add(labelNum);
 		
		// data.push(row);
			
		pills.next();
	}
	pills.close();
	// Always close db when you're done to save resources
	db.close();
	
	// Pass data to the tableview
	//$.table.setData(data);
	return data;
};
exports.getPills = getPills;