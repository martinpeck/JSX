/***
 * JavaScript source-map generator
 * @see Source Map Revision 3 Proposal - https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit
 */

/*
 * Copyright (c) 2012 DeNA Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import "./util.jsx";

native ("require('source-map').SourceMapGenerator") class SourceMapGenerator {
	function constructor(options : Map.<string>);
	function addMapping(mapping : Map.<variant>) : void;
	function setSourceContent(sourceFile : string, sourceContent : string) : void;
}

native ("require('source-map').SourceMapConsumer") class SourceMapConsumer {
	function constructor(mapping : variant);
	function originalPositionFor(generatedPos : variant) : variant;
}


class SourceMapper {

	var _rootDir : string;
	var _outputFile : string;
	var _impl : SourceMapGenerator;

	var _sourceFiles = new Map.<boolean>();

	function constructor (rootDir : string, outputFile : string) {
		this._rootDir = rootDir;
		this._outputFile = Util.resolvePath(outputFile);
		this._impl = new SourceMapGenerator({
			file       : Util.basename(this._outputFile)
		});
	}

	function add (generatedPos : Map.<number>, originalPos : Map.<number>, sourceFile : Nullable.<string>, tokenName : Nullable.<string>) : void {
		if (sourceFile != null) {
			this._sourceFiles[sourceFile] = true;
			if (sourceFile.indexOf(this._rootDir + "/") == 0) {
				sourceFile = sourceFile.substring(this._rootDir.length + 1);
			}
		}
		this._impl.addMapping({
			generated: generatedPos,
			original:  originalPos,
			source:    sourceFile,
			name:      tokenName
		} : Map.<variant>);
	}

	function setSourceContent(sourceFile : string, sourceContent : string) : void {
		this._impl.setSourceContent(sourceFile, sourceContent);
	}

	function getSourceMappingFile () : string {
		return this._outputFile + ".mapping";
	}

	function getSourceFiles() : string[] {
		return this._sourceFiles.keys();
	}

	function generate () : string {
		return this._impl.toString();
	}

	function magicToken () : string {
		var sourceMappingFile = Util.basename(this.getSourceMappingFile());
		return "\n" + "//# sourceMappingURL=" + sourceMappingFile + "\n";
	}
}
