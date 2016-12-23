const fs = require('fs');
const mkdirp = require('mkdirp');

const svgtojsx = require('svg-to-jsx');

function splitAndToCamelCase(s) {
	return (s||'').toLowerCase().replace(/(\b|-|_)\w/g, function(m) {
    return m.toUpperCase().replace(/(-|_)/,'');
  });
}

function convertSingle(svgFolderPath, svgFilename, svgFileExt, widgetFolderPath) {
	const svgFilePath = svgFolderPath + "/" + svgFilename + "." + svgFileExt;
	console.log(svgFilePath);		

	const svgContents = fs.readFileSync(svgFilePath, 'utf-8');

	const className = splitAndToCamelCase(svgFilename);  
	const widgetFilePath = widgetFolderPath + "/" + className + ".js"; 
	svgtojsx(svgContents).then(function(jsx) {
			const theJsContent = [
				"'use-strict';",
				"",
				"const React = require('react');", 
				"const Component = React.Component;",
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
