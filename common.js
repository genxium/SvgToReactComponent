const fs = require('fs');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;

exports.splitAndToCamelCase = function(s) {
	return (s||'').toLowerCase().replace(/(\b|-|_)\w/g, function(m) {
    return m.toUpperCase().replace(/(-|_)/,'');
  });
};

function extractAttributeListOfXml(s, attrName) {
	// Reference 1, https://github.com/goto100/xpath.
	// Reference 2, https://github.com/goto100/xpath/blob/master/docs/xpath%20methods.md.
	const doc = new dom().parseFromString(s);
	let ret = [];
	try {
		const xpathQuery = "//*/@" + attrName + "";
		const nodeList = xpath.select(xpathQuery, doc);
		let dedupeSet = new Set();
		if (nodeList) {
			nodeList.map(function(singleNode) {
				dedupeSet.add(singleNode.value);
			});	
		}
		for (let nodeValue of dedupeSet) {
			ret.push(nodeValue);	
		} 
	} catch(err) {
		console.error(err);
	}

	return ret;
};

exports.extractAttributeListOfXml = extractAttributeListOfXml;

exports.generateCssTemplate = function(svgContent, className, cssFilePath, isJsx) {
	const idList = extractAttributeListOfXml(svgContent, 'id');
	console.log("idList,");
	console.dir(idList);
	let idBlockList = [];
	idList.map(function(singleId) {
		const singleIdBlock = [
			"#" + singleId + " {",
			"}",
			"",
		].join('\n');
		idBlockList.push(singleIdBlock);
	});
	
	const classList = extractAttributeListOfXml(svgContent, (isJsx ? 'className' : 'class'));
	console.log("classList,");
	console.dir(classList);
	let classBlockList = [];
	classList.map(function(singleClass) {
		const singleClassBlock = [
			"." + singleClass + " {",
			"}",
			"",
		].join('\n');
		classBlockList.push(singleClassBlock);
	});

	let allCssBlockList = [
		"/* Specify CSS attributes here. Reference https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_started/SVG_and_CSS. */",
		"",
	];
	
	allCssBlockList = allCssBlockList.concat(idBlockList);
	allCssBlockList = allCssBlockList.concat(classBlockList);

	const theCssContent = allCssBlockList.join('\n');
	fs.writeFile(cssFilePath, theCssContent); 
}
