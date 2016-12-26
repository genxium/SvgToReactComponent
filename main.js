const fs = require('fs');
const mkdirp = require('mkdirp');

const svgtojsx = require('svg-to-jsx');
const common = require('./common');

function convertSingle(svgFolderPath, svgFilename, svgFileExt, widgetFolderPath) {
	const svgFilePath = svgFolderPath + "/" + svgFilename + "." + svgFileExt;
	const svgContents = fs.readFileSync(svgFilePath, 'utf-8');

	const className = common.splitAndToCamelCase(svgFilename);  
	const cssRelativeFilepathForWidget = "./" + className + ".css";

	const widgetFilePath = widgetFolderPath + "/" + className + ".js"; 
	svgtojsx(svgContents).then(function(jsx) {
			
			// NOTE: There could be conversion lost of tags.

			const theJsContent = [
				"'use-strict';",
				"",
				"const React = require('react');", 
				"const Component = React.Component;",
				"",
				"try {",
				"	// Needs feasible css-loader.",
				"	require('" + cssRelativeFilepathForWidget + "');",
				"} catch(err) {",
				" // Error handling here.",
				"}",
				"",
				"class " + className + " extends Component {",
				"	render() {",
				"		const widgetRef = this;",
				"		return (",
				"			<div style={widgetRef.props.style}>",
				"				" + jsx,
				"			</div>",
				"		);",
				"	}",
				"}",
				"",
				"export default " + className + ";",
			].join('\n');

			fs.writeFile(widgetFilePath, theJsContent); 

			// Create the template css file w.r.t. jsx content.
			const cssFilePath = widgetFolderPath + "/" + className + ".css";
			common.generateCssTemplate(jsx, className, cssFilePath, true);
	});
}

const widgetFolderPath = "./widgets";
mkdirp(widgetFolderPath, function (err) {
	if (err) {
		console.error(err)
		return;
	}

	const svgFolderPath = "./svg_files";
	fs.readdir(svgFolderPath, 'utf-8', (err, files) => {
		if (err) return;
		files.map(function(fullFilename) {
			const parts = fullFilename.split('.');
			const partsCount = parts.length;
			const filename = parts[0];
				
			let extParts = [];
			for (let i = 1; i < partsCount; ++i) {
				extParts.push(parts[i]);
			}	
			const ext = extParts.join('.');
			convertSingle(svgFolderPath, filename, ext, widgetFolderPath);
		});
	});
	
});
