require('dotenv').config({path: '.env'});
const shell = require('shelljs');
const fs = require('fs');
const dateFormat = require('dateformat');

const Enumeration = require('../Models/Enumerations');
const Program = require('../Models/Programs');
const Monitorings = require('../Models/Monitorings');
const BOT = require('../Config/TelegramBot');
const date = dateFormat(new Date(), "yyyy-mm-dd-HH-MM");

const GO_DIR=`${process.env.GO_DIR}`;
const TOOLS_DIR=`${process.env.TOOLS_DIR}`;
const GOBUSTERDNS_DICT =`${process.env.GOBUSTERDNS_DICT}`;
const GIT_TOKEN = `${process.env.GIT_TOKEN}`;

const APIKEY_VIRUSTOTAL = `${process.env.APIKEY_VIRUSTOTAL}`;
const APIKEY_FB_TOKEN = `${process.env.APIKEY_FB_TOKEN}`;
const APIKEY_SECURITYTRAILS = `${process.env.APIKEY_SECURITYTRAILS}`;


ExecuteSubdomainEnumeration = (client) => {
    client.on('execute-subdomain-enumeration', async (payload) => {
        try {
            const id = payload._id
            const enumeration = await Enumeration.findById(id).exec();
            if(enumeration) {
                var firstExecution = false;
                let allSubdomainsFile = `${enumeration.Directory}/Subdomains-${enumeration.Scope.toUpperCase()}.txt`;
        
                let newSubdomainsFile = `${enumeration.Directory}/NewSubdomains-${enumeration.Scope.toUpperCase()}-${date}.txt`;
                let auxNewSubdomainsFile = `${enumeration.Directory}/AuxNewSubdomains-${enumeration.Scope}-${date}.txt`;
        
        
                let findomainFile = `${enumeration.Directory}/Findomain-${enumeration.Scope}-${date}.txt`;
                let subfinderFile = `${enumeration.Directory}/Subfinder-${enumeration.Scope}-${date}.txt`;
                let assetFinderFile = `${enumeration.Directory}/Assetfinder-${enumeration.Scope}-${date}.txt`;
                let amassFile = `${enumeration.Directory}/Amass-${enumeration.Scope}-${date}.txt`;
        
                /* SINTAXIS DE CADA HERRAMIENTA */
                const findomain = `findomain -t ${enumeration.Scope} -u ${findomainFile}`;
                const subfinder = `subfinder -d ${enumeration.Scope} -t 40 -timeout 5 -o ${subfinderFile}`;
                const assetFinder = `${GO_DIR}assetfinder --subs-only ${enumeration.Scope} | tee -a ${assetFinderFile}`;
                const amass = `amass enum -passive -d ${enumeration.Scope} -max-dns-queries 100 -o ${amassFile} `; 
        
                enumeration.Syntax=[findomain,subfinder,assetFinder,amass];
        
                client.emit('executed-subdomain-enumeration', {
                    success: true,
                    executing: true,
                    msg: `Executing Subdomain Enumeration on ${enumeration.Scope}...`
                });
        
                shell.exec(findomain); //Ejecuto Findomain
                shell.exec(subfinder); //Ejecuto Subfinder
                shell.exec(assetFinder); //Ejecuto Assetfinder
                shell.exec(amass); //Ejecuto Amass
        
                shell.exec(`cat ${findomainFile} ${subfinderFile} ${assetFinderFile} ${amassFile} >> ${auxNewSubdomainsFile}`); // Guardo todos los resultados en un Txt Auxiliar
                shell.exec(`sort -u ${auxNewSubdomainsFile} -o ${auxNewSubdomainsFile}`); // Ordeno y filtro resultados.
        
                if(!fs.existsSync(allSubdomainsFile)){
                    firstExecution = true;
                    shell.exec(`cat ${auxNewSubdomainsFile} >> ${allSubdomainsFile}`); // Si no existe ningun archivo AllSubd inicializo con todos los encontrados.
                }
            
                shell.exec(`awk 'NR == FNR{ a[$0] = 1;next } !a[$0]' ${allSubdomainsFile} ${auxNewSubdomainsFile} >> ${newSubdomainsFile}`); // Filtro entre AllSubd y NewSub para luego armar un Txt de NuevosSubdominios a Monitorear.
                shell.exec(`rm -r ${auxNewSubdomainsFile} ${findomainFile} ${subfinderFile} ${assetFinderFile} ${amassFile}`); //Elimino txts.
                shell.exec(`cat ${newSubdomainsFile} >> ${allSubdomainsFile}`); // Guardo todos los resultados en AllSubdomains.
        
                enumeration.NewFile = newSubdomainsFile; // Guardo New Subdomains.
                enumeration.File = allSubdomainsFile; // Guardo File.
                enumeration.Executed = true; //Cambio estado a Executed.
                enumeration.save();

        
                let Results = FileToArray(newSubdomainsFile);

                const monitoring = new Monitorings({
                    Program: enumeration.Program,
                    Scope: enumeration.Scope,
                    Type: 1,
                    Results: Results
                });

                const program = await Program.findById(payload.Program);
                program.Files.push(allSubdomainsFile);
        
                if(firstExecution){
                    let Results = FileToArray(allSubdomainsFile);
        
                    monitoring.Results = Results;
        
                    Results.forEach(element => {
                        if(element.length !== 0){
                            program.Subdomains.push(element);
                        }
                    });
                } else {
                    Results.forEach(element => {
                        if(element.length !== 0){
                            program.Subdomains.push(element);
                        }
                    });
        
                }
                
                BOT.SendMessage(`New Subdomains [${Results.length}] → ${Results.toString()}`);
                monitoring.save();
                program.save();
        
                client.emit('executed-subdomain-enumeration', {
                    success: true,
                    executing: false,
                    msg: `Subdomain enumeration executed Succesfully...`
                });
            } else {
                client.emit('executed-subdomain-enumeration', {
                    success: false,
                    executing: false,
                    msg: `Loading results, please try again...`
                });
            }
        } catch (e) {
            console.error(e);
        }  
    });
}

ExecutePermutationEnumeration = (client) => {
    client.on('execute-permutation-enumeration', async (payload) => {
        try {
            const id = payload._id
            const enumeration = await Enumeration.findById(id).exec();
            
            if(enumeration) {
                
                const allSubdomainsFile = `${enumeration.Directory}/Subdomains-${enumeration.Scope.toUpperCase()}.txt`;
                const newSubdomainsFile = `${enumeration.Directory}/NewSubdomains-${enumeration.Scope.toUpperCase()}-${date}.txt`;
                const auxNewSubdomainsFile = `${enumeration.Directory}/AuxNewSubdomains-${enumeration.Scope}-${date}.txt`;
                const gobusterAuxSubdomainsFile = `${enumeration.Directory}/AuxGobuster-${enumeration.Scope}-${date}.txt`;

                if(!fs.existsSync(allSubdomainsFile)){
                    client.emit('executed-subdomain-enumeration', {
                        success: false,
                        executing: false,
                        msg: `Execute common Subdomain Enumeration first...`
                    });
                } else {

                    const data = fs.readFileSync(allSubdomainsFile, 'UTF-8');
                    const dataArr = data.split('\n');

                    client.emit('executed-subdomain-enumeration', {
                        success: true,
                        executing: true,
                        msg: `Executing Permutation Subdomain Enumeration on ${enumeration.Scope}...`
                    });


                    dataArr.forEach(element => {
                        shell.exec(`${GO_DIR}gobuster dns -d ${element.trim()} -w ${GOBUSTERDNS_DICT} -t 50 -o ${gobusterAuxSubdomainsFile}`);
                        shell.exec(`sed 's/Found: //g' ${gobusterAuxSubdomainsFile} >> ${auxNewSubdomainsFile}`);
                        shell.exec(`rm -r ${gobusterAuxSubdomainsFile}`);
                    });

                    shell.exec(`sort -u ${auxNewSubdomainsFile} -o ${auxNewSubdomainsFile}`); // Ordeno y filtro resultados.
                
                    shell.exec(`awk 'NR == FNR{ a[$0] = 1;next } !a[$0]' ${allSubdomainsFile} ${auxNewSubdomainsFile} >> ${newSubdomainsFile}`); // Filtro entre AllSubd y NewSub para luego armar un Txt de NuevosSubdominios a Monitorear.
                    shell.exec(`rm -r ${auxNewSubdomainsFile}`); //Elimino txts.
                    shell.exec(`cat ${newSubdomainsFile} >> ${allSubdomainsFile}`); // Guardo todos los resultados en AllSubdomains.

                    enumeration.NewFile = newSubdomainsFile; // Guardo New Subdomains.
                    enumeration.File = allSubdomainsFile; // Guardo File.
                    enumeration.Executed = true; //Cambio estado a Executed.
                    enumeration.save();

                    let Results = FileToArray(newSubdomainsFile);

                    const monitoring = new Monitorings({
                        Program: enumeration.Program,
                        Scope: enumeration.Scope,
                        Type: 1,
                        Results: Results
                    });
            
                    const program = await Program.findById(payload.Program);
                    program.Files.push(allSubdomainsFile);

                    Results.forEach(element => {
                        if(element.length !== 0){
                            program.Subdomains.push(element);
                        }
                    });

                    BOT.SendMessage(`New Subdomains [${Results.length}] → ${Results.toString()}`);
                    monitoring.save();
                    program.save();
            
                    client.emit('executed-subdomain-enumeration', {
                        success: true,
                        executing: false,
                        msg: `Subdomain permutation enumeration executed Succesfully...`
                    });
                }

            } else {

                client.emit('executed-subdomain-enumeration', {
                    success: false,
                    executing: false,
                    msg: `Loading results, please try again...`
                });
            }
        } catch (e) {
            console.error(e);
        }
        
    });
}

ExecuteGithubEnumeration = (client) => {
    client.on('execute-github-enumeration', async (payload) => {
        try {
            const id = payload._id
            const enumeration = await Enumeration.findById(id).exec();

            if(enumeration) {
                
                const allSubdomainsFile = `${enumeration.Directory}/Subdomains-${enumeration.Scope.toUpperCase()}.txt`;
                const newSubdomainsFile = `${enumeration.Directory}/NewSubdomains-${enumeration.Scope.toUpperCase()}-${date}.txt`;
                const auxNewSubdomainsFile = `${enumeration.Directory}/AuxNewSubdomains-${enumeration.Scope}-${date}.txt`;
                const gitAuxSubdomainsFile = `${enumeration.Directory}/AuxGit-${enumeration.Scope}-${date}.txt`;

                if(!fs.existsSync(allSubdomainsFile)){
                    client.emit('executed-subdomain-enumeration', {
                        success: false,
                        executing: false,
                        msg: `Execute common Subdomain Enumeration first...`
                    });
                } else {

                    const data = fs.readFileSync(allSubdomainsFile, 'UTF-8');
                    const dataArr = data.split('\n');

                    client.emit('executed-subdomain-enumeration', {
                        success: true,
                        executing: true,
                        msg: `Executing Github Subdomain Enumeration on ${enumeration.Scope}...`
                    });


                    dataArr.forEach(element => {
                        console.log(`Executing Github in ${element}...`);
                        shell.exec(`python3 ${TOOLS_DIR}/github-search/github-subdomains.py -d ${element.trim()} -t ${GIT_TOKEN} | tee -a ${gitAuxSubdomainsFile}`);
                        shell.exec(`sed 's/Found: //g' ${gitAuxSubdomainsFile} >> ${auxNewSubdomainsFile}`);
                        shell.exec(`rm -r ${gitAuxSubdomainsFile}`);
                    });

                    shell.exec(`sort -u ${auxNewSubdomainsFile} -o ${auxNewSubdomainsFile}`); // Ordeno y filtro resultados.
                
                    shell.exec(`awk 'NR == FNR{ a[$0] = 1;next } !a[$0]' ${allSubdomainsFile} ${auxNewSubdomainsFile} >> ${newSubdomainsFile}`); // Filtro entre AllSubd y NewSub para luego armar un Txt de NuevosSubdominios a Monitorear.
                    shell.exec(`rm -r ${auxNewSubdomainsFile}`); //Elimino txts.
                    shell.exec(`cat ${newSubdomainsFile} >> ${allSubdomainsFile}`); // Guardo todos los resultados en AllSubdomains.

                    enumeration.NewFile = newSubdomainsFile; // Guardo New Subdomains.
                    enumeration.File = allSubdomainsFile; // Guardo File.
                    enumeration.Executed = true; //Cambio estado a Executed.
                    enumeration.save();

                    let Results = FileToArray(newSubdomainsFile);

                    const monitoring = new Monitorings({
                        Program: enumeration.Program,
                        Scope: enumeration.Scope,
                        Type: 1,
                        Results: Results
                    });
            
                    const program = await Program.findById(payload.Program);
                    program.Files.push(allSubdomainsFile);

                    Results.forEach(element => {
                        if(element.length !== 0){
                            program.Subdomains.push(element);
                        }
                    });

                    BOT.SendMessage(`New Subdomains Found [${Results.length}] → ${Results.toString()}`);
                    monitoring.save();
                    program.save();
            
                    client.emit('executed-subdomain-enumeration', {
                        success: true,
                        executing: false,
                        msg: `Subdomain github enumeration executed Succesfully...`
                    });
                }

            } else {

                client.emit('executed-subdomain-enumeration', {
                    success: false,
                    executing: false,
                    msg: `Loading results, please try again...`
                });
            }
        } catch (e) {
            console.error(e);
        }
        
    });
}

ExecuteAlive = (client) => {
    client.on('execute-alive', async (payload) => {
        try {
            const id = payload.Alive._id;
            const enumeration = await Enumeration.findById(id).exec();
    
            if(enumeration){
                fs.access(payload.Alive.Directory, function(err) {
                    if (err && err.code === 'ENOENT') {
                        fs.mkdir(payload.Alive.Directory); //CREA DIRECTORIO POR SI ES NULL
                        enumeration.Directory = payload.Alive.Directory;
                    } else {
                        enumeration.Directory = payload.Alive.Directory;
                    }
                });
                var firstExecution = false;
        
                let allAlivesFile = `${enumeration.Directory}/Alives-${enumeration.Scope.toUpperCase()}.txt`;
                let newAlivesFile = `${enumeration.Directory}/NewAlives-${enumeration.Scope.toUpperCase()}-${date}.txt`;
                let auxNewAlivesFile = `${enumeration.Directory}/AuxNewAlives-${enumeration.Scope.toUpperCase()}-${date}.txt`;
        
                /* SINTAXIS DE CADA HERRAMIENTA */            
                const httprobe = `cat ${payload.Subdomain.File} | ${GO_DIR}httprobe -t 10000 -c 35 | tee -a ${auxNewAlivesFile}`;
                
                enumeration.Syntax = [httprobe];
                enumeration.PathDirectory = payload.Alive.Program.PathDirectory;
                
                client.emit('executed-alive', {
                    success: true,
                    executing: true,
                    msg: `Executing Alive Enumeration on ${enumeration.Scope}...`
                });
                    
                shell.exec(httprobe); //Ejecuto Httprobe
        
                if(!fs.existsSync(allAlivesFile)){
                    fs.appendFileSync(allAlivesFile, '', (err) => {
                        if (err) {
                            return fs.appendFileSync(`${enumeration.Directory}/Error.txt`, err);
                        }
                    });
                    firstExecution = true;
                    shell.exec(`cat ${auxNewAlivesFile} >> ${allAlivesFile}`); // Si no existe ningun archivo All inicializo con todos los encontrados.
                }
            
                shell.exec(`awk 'NR == FNR{ a[$0] = 1;next } !a[$0]' ${allAlivesFile} ${auxNewAlivesFile} >> ${newAlivesFile}`); // Filtro entre AllAlive y NewAlives para luego armar un Txt de NuevosSubdominios a Monitorear.
                shell.exec(`rm -r ${auxNewAlivesFile}`); //Elimino txt auxiliar.
        
                shell.exec(`cat ${newAlivesFile} >> ${allAlivesFile}`); // Guardo todos los resultados en AllAlives.
        
                enumeration.NewFile = newAlivesFile; // Guardo New Alives.
                enumeration.File = allAlivesFile; // Guardo File.
                enumeration.Executed = true; //Cambio estado a Executed.
                enumeration.save();
        
                let Results = FileToArray(newAlivesFile);
        
                const monitoring = new Monitorings({
                    Program: enumeration.Program,
                    Scope: enumeration.Scope,
                    Type: 2,
                    Results: Results
                });
        
                const program = await Program.findById(payload.Alive.Program);
        
                program.Files.push(allAlivesFile);
        
                if(firstExecution){
        
                    let Results = FileToArray(allAlivesFile);

                    monitoring.Results = Results;
        
                    Results.forEach(element => {
                        if(element.length !== 0){
                            program.Alives.push(element);
                        }
                    });
                } else {
                    Results.forEach(element => {
                        if(element.length !== 0){
                            program.Alives.push(element);
                        }
                    });
                }
        
                BOT.SendMessage(`New Alive Subdomains Found [${Results.length}] → ${Results.toString()}`);
                monitoring.save();
                program.save();
        
                client.emit('executed-alive', {
                    success: true,
                    executing: false,
                    msg: `Alive enumeration executed Succesfully...`
                });
            } else {
                client.emit('executed-alive', {
                    success: false,
                    executing: false,
                    msg: `Loading results, please try again...`
                });
            }
        } catch (e) {
            console.error(e);
        }
    });

}

ExecuteScreenshot = (client) => {
    client.on('execute-screenshot', async (payload) => {
        try {

            const id = payload.Screenshots._id;
            const enumeration = await Enumeration.findById(id).exec();

            if(enumeration) {
                /* SINTAXIS */            
                const aquatone = `cat ${payload.Alives.File} | ${GO_DIR}aquatone -out ${enumeration.Directory}`;
                
                enumeration.Syntax = aquatone;
                
                client.emit('executed-screenshot', {
                    success: true,
                    executing: true,
                    msg: `Taking Screenshots on ${enumeration.Scope}...`
                });
                    
                shell.exec(aquatone); //Ejecuto Aquatone

                enumeration.Executed = true; //Cambio estado a Executed.

                const program = await Program.findById(enumeration.Program);

                if(enumeration.Executed){
                    var screenshotFileDirectory = `${enumeration.Directory}/aquatone_report.html`;
                    var startIndex = screenshotFileDirectory.search(`${program.Name}`);
                    var screenshotFile = screenshotFileDirectory.slice(startIndex, screenshotFileDirectory.length);

                    enumeration.File = screenshotFileDirectory;
                    enumeration.UrlFile = screenshotFile;
                    program.Screenshots.push(screenshotFile);
                    program.Files.push(screenshotFileDirectory);
                    program.save();
                } 

                enumeration.save();
        
                client.emit('executed-screenshot', {
                    success: true,
                    executing: false,
                    msg: `Screenshots taked Succesfully...`
                });
            } else {
                client.emit('executed-screenshot', {
                    success: false,
                    executing: false,
                    msg: `Loading results, please try again...`
                });
            }
            
        } catch(e) {
            console.error(e);
        }        
    });
}

ExecuteJSScanner = (client) => {
    client.on('execute-jsscanner', async (payload) => {
        try {
            const id = payload._id;
            const enumeration = await Enumeration.findById(id).exec();
            if(enumeration) {

                const jsResultName = payload.Subdomain.split('://');
                const linkfinder = `python3 ${TOOLS_DIR}/LinkFinder/linkfinder.py -i ${payload.Subdomain} -d -o ${payload.Directory}/${jsResultName[0]}-${jsResultName[1]}.html`;

                enumeration.Syntax = linkfinder;
                
                client.emit('executed-jsscanner', {
                    success: true,
                    executing: true,
                    msg: `Scanning JS Files on ${enumeration.Scope}...`
                });

                shell.exec(linkfinder); //Ejecuto Aquatone

                enumeration.Executed = true; //Cambio estado a Executed.
                
                const program = await Program.findById(enumeration.Program);

                if(enumeration.Executed){
                    var jsFileDirectory = `${enumeration.Directory}/${jsResultName[0]}-${jsResultName[1]}.html`;
                    var startIndex = jsFileDirectory.search(`${program.Name}`);
                    var jsFile = jsFileDirectory.slice(startIndex, jsFileDirectory.length);


                    enumeration.File = jsFileDirectory;
                    enumeration.UrlFile = jsFile;
                    program.Screenshots.push(jsFile);
                    program.Files.push(jsFileDirectory);
                    program.save();
                } 

                enumeration.save();
        
                client.emit('executed-jsscanner', {
                    success: true,
                    executing: false,
                    msg: `JS Files Scanned Succesfully...`
                });


            } else {
                client.emit('executed-jsscanner', {
                    success: false,
                    executing: false,
                    msg: `Loading results, please try again...`
                });
            }
        }
        catch (e) {
            console.error(e);
        }
    });
}

ExecuteSubdomainResponseCodes = (client) => {
    client.on('execute-response-codes', async (payload) => {
        try {
            
            const id = payload.Enumeration._id;
            const enumeration = await Enumeration.findById(id).exec();
            
            if(enumeration) {
                
                /* SINTAXIS */            
                const reponseCodesFile = `${enumeration.Directory}/ResponseCodes-${enumeration.Scope.toUpperCase()}.txt`;
                const newReponseCodesFile = `${enumeration.Directory}/NewResponseCodes-${enumeration.Scope.toUpperCase()}-${date}.txt`;
                const auxNewResponseCodesFile = `${enumeration.Directory}/AuxNewResponseCodes-${enumeration.Scope.toUpperCase()}-${date}.txt`;
                
                const hakcheckurl = `cat ${payload.Alives.File} | ${GO_DIR}hakcheckurl | tee -a ${auxNewResponseCodesFile}`;

                var firstExecution = false;

                enumeration.Syntax = hakcheckurl;
                
                client.emit('executed-response-codes', {
                    success: true,
                    executing: true,
                    msg: `Scanning Response Codes on ${enumeration.Scope}...`
                });
                    
                shell.exec(hakcheckurl); //Ejecuto Response Codes Scanning
        
                if(!fs.existsSync(reponseCodesFile)){
                    fs.appendFileSync(reponseCodesFile, '', (err) => {
                        if (err) {
                            return fs.appendFileSync(`${enumeration.Directory}/Error.txt`, err);
                        }
                    });

                    firstExecution = true;
                    shell.exec(`cat ${auxNewResponseCodesFile} >> ${reponseCodesFile}`); // Si no existe ningun archivo All inicializo con todos los encontrados.
                }

                shell.exec(`awk 'NR == FNR{ a[$0] = 1;next } !a[$0]' ${reponseCodesFile} ${auxNewResponseCodesFile} >> ${newReponseCodesFile}`); // Filtro entre All Response Codes y New Response Codes para luego armar un Txt de NuevosSubdominios a Monitorear.
                shell.exec(`rm -r ${auxNewResponseCodesFile}`); //Elimino txt auxiliar.
        
                shell.exec(`cat ${newReponseCodesFile} >> ${reponseCodesFile}`); // Guardo todos los resultados en ResponseCodes.

                enumeration.NewFile = newReponseCodesFile; // Guardo New Response Codes.
                enumeration.File = reponseCodesFile; // Guardo File.
                enumeration.Executed = true; //Cambio estado a Executed.
                enumeration.save();
        
                let Results = FileToArray(newReponseCodesFile);
        
                const monitoring = new Monitorings({
                    Program: enumeration.Program,
                    Scope: enumeration.Scope,
                    Type: 5,
                    Results: Results
                });
        
                const program = await Program.findById(payload.Enumeration.Program);
                
                program.Files.push(reponseCodesFile);
        
                if(firstExecution){
                    let Results = FileToArray(reponseCodesFile);

                    monitoring.Results = Results;

                    Results.forEach(element => {
                        if(element.length !== 0){ 
                            let statusCode = element.split(' ')[0];
                            let subdomain = element.split(' ')[1];
                            
                            let ResponseCodes = {
                                StatusCode: statusCode,
                                Subdomain: subdomain
                            }
                            program.ResponseCodes.push(ResponseCodes);
                        }
                    });
                } else {
                    Results.forEach(element => {
                        if(element.length !== 0){
                            let statusCode = element.split(' ')[0];
                            let subdomain = element.split(' ')[1];
                            
                            let ResponseCodes = {
                                StatusCode: statusCode,
                                Subdomain: subdomain
                            }
                            program.ResponseCodes.push(ResponseCodes);
                        }
                    });
                }
        
                monitoring.save();
                program.save();

                client.emit('executed-response-codes', {
                    success: true,
                    executing: false,
                    msg: `Response Code scanning executed Succesfully...`
                });


            } else {
                client.emit('executed-response-codes', {
                    success: false,
                    executing: false,
                    msg: `Loading results, please try again...`
                });
            }
            
        } catch(e) {
            console.error(e);
        }        
    });
}

function FileToArray(file){

    let fileToArray = [];

    fileToArray = fs.readFileSync(file, {encoding: 'utf-8'}).split('\n');
    
    return fileToArray;
}


module.exports = {
    ExecuteSubdomainEnumeration,
    ExecuteAlive,
    ExecuteScreenshot,
    ExecuteJSScanner,
    ExecuteSubdomainResponseCodes,
    ExecutePermutationEnumeration,
    ExecuteGithubEnumeration
}
