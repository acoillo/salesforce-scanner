// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

const TERMINAL_RUN_SCANNER_NAME = "Terminal to run scanner";
const RUNNING_SCRIPT = "Running scanner correctly...";
const WARNING_MESSAGE =
	"The file to be scanned must be JavaScript (LWC) or Apex.";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log(
		'Congratulations, your extension "salesforce-scanner" is now active!'
	);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand(
		"salesforce-scanner.runScannerESLintSF",
		(uri: vscode.Uri | null | undefined) => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user

			if (uri !== null && uri !== undefined) {
				let terminal;
				let script;

				const path = uri.fsPath;
				const fileName = path.substring(
					path.lastIndexOf("\\") + 1,
					path.lastIndexOf(".")
				);
				const extension = path.substring(path.lastIndexOf(".") + 1);

				if (vscode.window.terminals.length > 0) {
					terminal = vscode.window.terminals[0];
				} else {
					terminal = vscode.window.createTerminal(
						TERMINAL_RUN_SCANNER_NAME
					);
				}

				switch (extension) {
					case "js":
						script = `sfdx scanner:run --format html --outfile ".\\scanner\\analyzer-${fileName}.html" --engine "eslint-lwc" --eslintconfig ".\\force-app\\main\\default\\lwc\\.eslintrc.json" --target ".\\force-app\\main\\default\\lwc\\${fileName}\\${fileName}.js"`;
						break;
					case "cls":
						script = `sfdx scanner:run --format=html --outfile=.\\scanner\\analyzer-${fileName}.html --target=".\\force-app\\main\\default\\classes\\${fileName}.cls"`;
						break;
					default:
				}

				if (script) {
					terminal.sendText(script);
					vscode.window.showInformationMessage(RUNNING_SCRIPT);
				} else {
					vscode.window.showWarningMessage(WARNING_MESSAGE);
				}
			}
		}
	);

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
