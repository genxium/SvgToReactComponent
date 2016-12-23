const fs = require('fs');
const mkdirp = require('mkdirp');

const svgtojsx = require('svg-to-jsx');

function splitAndToCamelCase(s) {
	return (s||'').toLowerCase().replace(/(\b|-|_)\w/g, function(m) {
    return m.toUpperCase().replace(/(-|_)/,'');
  });
}

function convertSingle(svgFolderPath, svgFilename, svgFileExt, designerPackFolderPath) {
	const svgFilePath = svgFolderPath + "/" + svgFilename + "." + svgFileExt;
	console.log(svgFilePath);		

	const svgContents = fs.readFileSync(svgFilePath, 'utf-8');
	const className = splitAndToCamelCase(svgFilename);  
	
	mkdirp(designerPackFolderPath + "/" + className, function (err) {
		if (err) {
			console.error(err)
			return;
		}

		// Create the template css file.
		const cssFilePath = designerPackFolderPath + "/" + className + "/" + className + ".css";
		const theCssContent = [
			"/* Specify CSS attributes here. Reference https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_started/SVG_and_CSS. */",
		].join('\n');
		fs.writeFile(cssFilePath, theCssContent); 
		
		// Create the template html file.
		const htmlFilePath = designerPackFolderPath + "/" + className + "/" + className + ".html"; 
		svgtojsx(svgContents).then(function(jsx) {
				const theHtmlContent = [
					"<html>",
					"	" + jsx,
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
