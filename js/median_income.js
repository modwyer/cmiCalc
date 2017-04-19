/**
 * This module holds the current median income information.
 * This information comes from this website:
 *	http://www.justice.gov/ust/means-testing
 * Get the XLS or XLSx file of the current media income info, 
 * convert it to CSV, and then remove all the the none essential 
 * rows and formatting.  Once you have the states' info saved in 
 * the header-less CSV format, add '\n\' to the end of each row except
 * for the last row. Then copy all the rows and replace the ones below.
 */
var MEDIAN_INCOME = (function() {
	var mi = {};
	
	mi.get_median_income_data = function() {
		return "Alabama,42934,52310,59615,70056\n\
Alaska,61550,84219,85861,96612\n\
Arizona,46196,57953,61452,71154\n\
Arkansas,38776,47997,54488,66645\n\
California,51763,69370,74224,83012\n\
Colorado,55162,71140,80481,93932\n\
Connecticut,62145,79965,90723,111996\n\
Delaware,51059,67193,76892,92642\n\
District of Columbia,51260,97812,97812,112064\n\
Florida,44021,54655,59881,71480\n\
Georgia,42735,55600,61705,72290\n\
Hawaii,60296,72738,84039,96837\n\
Idaho,46196,54840,56527,70308\n\
Illinois,50133,65659,75454,90080\n\
Indiana,45834,56841,65324,76600\n\
Iowa,46560,62966,70105,82481\n\
Kansas,46998,62538,72072,82487\n\
Kentucky,42058,50882,56977,71955\n\
Louisiana,42527,52419,58564,71061\n\
Maine,48234,59646,66847,80929\n\
Maryland,62611,80492,91663,111281\n\
Massachusetts,60341,75462,92587,112235\n\
Michigan,46501,56651,67342,81951\n\
Minnesota,52127,70006,83974,100494\n\
Mississippi,36589,46130,49983,60420\n\
Missouri,44433,56574,64447,80161\n\
Montana,47081,57621,64161,78933\n\
Nebraska,46485,65341,71043,82676\n\
Nevada,46471,60841,61211,72010\n\
New Hampshire,61580,74428,88077,107348\n\
New Jersey,62149,74367,92489,113455\n\
New Mexico,42567,56985,56985,59505\n\
New York,50768,65233,74925,90852\n\
North Carolina,42411,55028,63717,71923\n\
North Dakota,52856,70214,80155,95271\n\
Ohio,45666,57216,67509,82005\n\
Oklahoma,43438,55828,60621,68201\n\
Oregon,49706,60786,69994,79171\n\
Pennsylvania,50501,60508,74083,89690\n\
Rhode Island,49691,67452,76119,99216\n\
South Carolina,42717,54905,60687,70981\n\
South Dakota,41719,62891,65706,80494\n\
Tennessee,42731,53216,59294,68298\n\
Texas,46127,60935,64894,75885\n\
Utah,55932,62119,70162,78717\n\
Vermont,53447,66365,79413,91793\n\
Virginia,55753,70976,81369,96513\n\
Washington,58417,71557,78760,91572\n\
West Virginia,44835,47723,56074,70510\n\
Wisconsin,47804,62130,75230,88133\n\
Wyoming,59227,71074,79220,81839\n\
Guam,39652,47410,54026,65379\n\
Northern Mariana Islands,26628,26628,30979,45564\n\
Puerto Rico,23462,23462,23462,29134\n\
Virgin Islands,31460,37811,40315,44168";
	}
	
	return mi;
}());