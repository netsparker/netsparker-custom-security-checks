/* 
 *  This script was generated by Netsparker 5.6.3.27454, at 09/03/2020 12:58:06 
 *  For more information about Custom Script Checks and samples, please refer to documentation: 
 *  https://www.netsparker.com/support/custom-security-checks-scripting/ 
 */
var attacks = [{
    id: '8638d643-0a44-4679-888a-74390ff828c9',
    name: 'Output Encoding Issues',
    attack: 'DLMTR!@#$%^&*()_+-=,./<>?;\':"[]\{}|`~DLMTR',
    attackUsage: AttackUsages.QueryPost
}];

function analyze(context, response) {
    // Main goal of this script is to check if the response contains one of the characters: !@#$%^&*()_+-=,./<>?;\':"[]\{}|`~ without encoding.
    var oeiRegEx = /(?<prefix>(?:DLMTR)(?:&[\w#]+;)*)(?<decoded>[!@#$%^&*()_+\-=,.\/<>?;':"[\]\\{}\|`~])(?<suffix>(?![\w#]+;)(?:.*)(?:DLMTR))/;
    responseBody = response.Body;

    var oeiResult;
    var resultArr = [];

    oeiResult = responseBody.match(oeiRegEx);

    while (oeiResult != null) {
        resultArr.push(oeiResult[2]);
        responseBody = responseBody.replace(oeiRegEx, "$1$3");
        logUI(responseBody);
        oeiResult = responseBody.match(oeiRegEx);
    }

    if (resultArr.length > 0) {
        vulnerability = new Vulnerability("8b2493f8-2607-43cb-b458-16fca8bf2127");
        vulnerability.CustomFields.Add('Reflected Input', resultArr.join(","));
        return vulnerability;
    }
}