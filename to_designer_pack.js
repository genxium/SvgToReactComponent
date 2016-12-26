const fs = require('fs');
const mkdirp = require('mkdirp');
const svgtojsx = require('svg-to-jsx');
const common = require('./common');

function convertSingle(svgFolderPath, svgFilename, svgFileExt, designerPackFolderPath) {
	const svgFilePath = svgFolderPath + "/" + svgFilename + "." + svgFileExt;
	console.log(svgFilePath);		

	const svgContents = fs.readFileSync(svgFilePath, 'utf-8');
	const className = common.splitAndToCamelCase(svgFilename);  
	
	mkdirp(designerPackFolderPath + "/" + className, function (err) {
		if (err) {
			console.error(err)
			return;
		}
		
		// Create the template css file w.r.t. svg content.
		const cssFilePath = designerPackFolderPath + "/" + className + "/" + className + ".css";
		common.generateCssTemplate(svgContents, className, cssFilePath, false);

		// Create the template html file.
		const htmlFilePath = designerPackFolderPath + "/" + className + "/" + className + ".html"; 
		svgtojsx(svgContents).then(function(jsx) {
			const theHtmlContent = [
				"<html>",
				"	" + svgContents,
				"<link rel=stylesheet href=\"./" + className + ".css\" type=\"text/css\">",
				"</html>",
			].join('\n');

			fs.writeFile(htmlFilePath, theHtmlContent); 
		});
	});
}

const designerPackFolderPath = "./designer_pack";
mkdirp(designerPackFolderPath, function (err) {
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
			convertSingle(svgFolderPath, filename, ext, designerPackFolderPath);
		});
	});
	
});
