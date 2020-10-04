require('dotenv').config({path: '.env'});
const shell = require('shelljs');
const fs = require('fs');
const dateFormat = require('dateformat');

const Enumerations = require('../Models/Enumerations');
const Program = require('../Models/Programs');
const Monitorings = require('../Models/Monitorings');
const Discoveries = require('../Models/Discoveries');

const date = dateFormat(new Date(), "yyyy-mm-dd-HH-MM");

const GO_DIR=`${process.env.GO_DIR}`;
const TOOLS_DIR=`${process.env.TOOLS_DIR}`;

const LIST_DIR=`${process.env.LIST_DIR}`;


const allSubdomainsFile = '';
const allAlivesFile = '';

exports.ExecuteCompleteScan = async (client) => {
    client.on('execute-complete-scan', async (payload) => {

        try {

            await ExecuteSubdomainEnumeration(payload, client);
            await ExecuteAlive(payload, client);
            await ExecuteScreenshot(payload, client);
            await ExecuteSubdomainResponseCodes(payload, client);
            await ExecuteWaybackurl(payload, client);
            await ExecuteGoSpider(payload, client);
            await ExecuteHakrawler(payload, client);
        
        } 
        catch (e) {
            console.error(e)
        }

    });
}


async function ExecuteSubdomainEnumeration(payload, client) {

    try {

        const program = await Program.findOne({Url: payload.Url});

        if(!program){
            client.emit('completed-scan', {
                success: false,
                executing: false,
                msg: `Doesn't exist program with this URL.`
            });
        }

        const enumeration = new Enumerations({
            Directory: CreateSubdomainEnumerationDirectory(program),
            Scope: payload.Scope,
            Program: program._id,
            Type: 1, // Tipo 1 = Subdomain Enumeration.
            Executed: false
        });

        if(enumeration) {
            var firstExecution = false;
            this.allSubdomainsFile = `${enumeration.Directory}/Subdomains-${enumeration.Scope.toUpperCase()}.txt`;
    
            let newSubdomainsFile = `${enumeration.Directory}/NewSubdomains-${enumeration.Scope.toUpperCase()}-${date}.txt`;
            let auxNewSubdomainsFile = `${enumeration.Directory}/AuxNewSubdomains-${enumeration.Scope}-${date}.txt`;
    
    
            let findomainFile = `${enumeration.Directory}/Findomain-${enumeration.Scope}-${date}.txt`;
            let subfinderFile = `${enumeration.Directory}/Subfinder-${enumeration.Scope}-${date}.txt`;
            let assetFinderFile = `${enumeration.Directory}/Assetfinder-${enumeration.Scope}-${date}.txt`;
            let amassFile = `${enumeration.Directory}/Amass-${enumeration.Scope}-${date}.txt`;
    
            /* SINTAXIS DE CADA HERRAMIENTA */
            const findomain = `findomain -t ${enumeration.Scope} -u ${findomainFile}`;
            const subfinder = `subfinder -d ${enumeration.Scope} -t 65 -timeout 15 -o ${subfinderFile}`;
            const assetFinder = `${GO_DIR}assetfinder --subs-only ${enumeration.Scope} | tee -a ${assetFinderFile}`;
            const amass = `amass enum -passive -d ${enumeration.Scope} -o ${amassFile}`; 
    
            enumeration.Syntax=[findomain,subfinder,assetFinder,amass];
    
            client.emit('completed-scan', {
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
    
            if(!fs.existsSync(this.allSubdomainsFile)){
                firstExecution = true;
                shell.exec(`cat ${auxNewSubdomainsFile} >> ${this.allSubdomainsFile}`); // Si no existe ningun archivo AllSubd inicializo con todos los encontrados.
            }
        
            shell.exec(`awk 'NR == FNR{ a[$0] = 1;next } !a[$0]' ${this.allSubdomainsFile} ${auxNewSubdomainsFile} >> ${newSubdomainsFile}`); // Filtro entre AllSubd y NewSub para luego armar un Txt de NuevosSubdominios a Monitorear.
            shell.exec(`rm -r ${auxNewSubdomainsFile} ${findomainFile} ${subfinderFile} ${assetFinderFile} ${amassFile}`); //Elimino txts.
            shell.exec(`cat ${newSubdomainsFile} >> ${this.allSubdomainsFile}`); // Guardo todos los resultados en AllSubdomains.
    
            enumeration.NewFile = newSubdomainsFile; // Guardo New Subdomains.
            enumeration.File = this.allSubdomainsFile; // Guardo File.
            enumeration.Executed = true; //Cambio estado a Executed.
            enumeration.save();

    
            let Results = FileToArray(newSubdomainsFile);
    
            const monitoring = new Monitorings({
                Program: enumeration.Program,
                Scope: enumeration.Scope,
                Type: 1,
                Results: Results
            });
    
            program.Files.push(this.allSubdomainsFile);
    
            if(firstExecution){
                let Results = FileToArray(this.allSubdomainsFile);
    
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
    
            monitoring.save();
            program.save();
    
            client.emit('completed-scan', {
                success: true,
                executing: false,
                msg: `Subdomain enumeration executed Succesfully...`
            });
        } else {
            client.emit('completed-scan', {
                success: false,
                executing: false,
                msg: `Loading results, please try again...`
            });
        }
    } catch (e) {
        console.error(e);
    }  

}

async function ExecuteAlive(payload, client){
    try {

        const program = await Program.findOne({Url: payload.Url});

        if(!program){
            client.emit('completed-scan', {
                success: false,
                executing: false,
                msg: `Doesn't exist program with this URL.`
            });
        }

        const enumeration = new Enumerations({
            Directory: CreateAliveDirectory(program),
            Scope: payload.Scope,
            Program: program._id,
            Type: 2, // Tipo 2 = Alive Enumeration.
            Executed: false
        });

        if(enumeration){

            var firstExecution = false;
    
            this.allAlivesFile = `${enumeration.Directory}/Alives-${enumeration.Scope.toUpperCase()}.txt`;
            let newAlivesFile = `${enumeration.Directory}/NewAlives-${enumeration.Scope.toUpperCase()}-${date}.txt`;
            let auxNewAlivesFile = `${enumeration.Directory}/AuxNewAlives-${enumeration.Scope.toUpperCase()}-${date}.txt`;
    
            /* SINTAXIS DE CADA HERRAMIENTA */            
            const httprobe = `cat ${this.allSubdomainsFile} | ${GO_DIR}httprobe | tee -a ${auxNewAlivesFile}`;
            
            enumeration.Syntax = [httprobe];
            
            client.emit('completed-scan', {
                success: true,
                executing: true,
                msg: `Executing Alive Enumeration on ${enumeration.Scope}...`
            });
                
            shell.exec(httprobe); //Ejecuto Httprobe
    
            if(!fs.existsSync(this.allAlivesFile)){
                fs.appendFileSync(this.allAlivesFile, '', (err) => {
                    if (err) {
                        return fs.appendFileSync(`${enumeration.Directory}/Error.txt`, err);
                    }
                });
                firstExecution = true;
                shell.exec(`cat ${auxNewAlivesFile} >> ${this.allAlivesFile}`); // Si no existe ningun archivo All inicializo con todos los encontrados.
            }
        
            shell.exec(`awk 'NR == FNR{ a[$0] = 1;next } !a[$0]' ${this.allAlivesFile} ${auxNewAlivesFile} >> ${newAlivesFile}`); // Filtro entre AllAlive y NewAlives para luego armar un Txt de NuevosSubdominios a Monitorear.
            shell.exec(`rm -r ${auxNewAlivesFile}`); //Elimino txt auxiliar.
    
            shell.exec(`cat ${newAlivesFile} >> ${this.allAlivesFile}`); // Guardo todos los resultados en AllAlives.
    
            enumeration.NewFile = newAlivesFile; // Guardo New Alives.
            enumeration.File = this.allAlivesFile; // Guardo File.
            enumeration.Executed = true; //Cambio estado a Executed.
            enumeration.save();
    
            let Results = FileToArray(newAlivesFile);
    
            const monitoring = new Monitorings({
                Program: enumeration.Program,
                Scope: enumeration.Scope,
                Type: 2,
                Results: Results
            });
    
            program.Files.push(this.allAlivesFile);
    
            if(firstExecution){
    
                let Results = FileToArray(this.allAlivesFile);

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
    
            monitoring.save();
            program.save();
    
            client.emit('completed-scan', {
                success: true,
                executing: false,
                msg: `Alive enumeration executed Succesfully...`
            });
        } else {
            client.emit('completed-scan', {
                success: false,
                executing: false,
                msg: `Loading results, please try again...`
            });
        }
    } catch (e) {
        console.error(e);
    }
}

async function ExecuteScreenshot(payload, client) {
    try {

        const program = await Program.findOne({Url: payload.Url});

        if(!program){
            client.emit('completed-scan', {
                success: false,
                executing: false,
                msg: `Doesn't exist program with this URL.`
            });
        }

        const executedEnumeration = await Enumerations.findOne({Program: program._id, Type: 3, Scope: payload.Scope});
    
        if(executedEnumeration) {
            shell.exec(`rm -r ${executedEnumeration.Directory}`);
            await executedEnumeration.remove();
        }

        const enumeration = new Enumerations({
            Directory: CreateScreenshotDirectory(program, payload.Scope),
            Scope: payload.Scope,
            Program: program,
            Type: 3, // Tipo 3 = Screenshots.
            Executed: false
        });
    

        if(enumeration) {
            /* SINTAXIS */            
            const aquatone = `cat ${this.allAlivesFile} | ${GO_DIR}aquatone -out ${enumeration.Directory}`;
            
            enumeration.Syntax = aquatone;
            
            client.emit('completed-scan', {
                success: true,
                executing: true,
                msg: `Taking Screenshots on ${enumeration.Scope}...`
            });
                
            shell.exec(aquatone); //Ejecuto Aquatone

            enumeration.Executed = true; //Cambio estado a Executed.

            if(enumeration.Executed){
                var screenshotFileDirectory = `${enumeration.Directory}/aquatone_report.html`;
                var startIndex = screenshotFileDirectory.search(`${program.Name}`);
                var screenshotFile = screenshotFileDirectory.slice(startIndex, screenshotFileDirectory.length);

                enumeration.File = screenshotFileDirectory;
                enumeration.UrlFile = screenshotFile;
                program.Screenshots.push(screenshotFile);
                program.Files.push(screenshotFileDirectory);
            } 

            enumeration.save();

            client.emit('completed-scan', {
                success: true,
                executing: false,
                msg: `Screenshots taked Succesfully...`
            });
        } else {
            client.emit('completed-scan', {
                success: false,
                executing: false,
                msg: `Loading results, please try again...`
            });
        }

        
    } catch(e) {
        console.error(e);
    }        
}

async function ExecuteSubdomainResponseCodes(payload, client) {
    try {

        const program = await Program.findOne({Url: payload.Url});

        if(!program){
            client.emit('completed-scan', {
                success: false,
                executing: false,
                msg: `Doesn't exist program with this URL.`
            });
        }

        const enumeration = new Enumerations({
            Directory: CreateResponseCodesDirectory(program),
            Scope: payload.Scope,
            Program: program._id,
            Type: 5, // Tipo 5 = Response Code Scanning.
            Executed: false
        });
        
        if(enumeration) {
            
            /* SINTAXIS */            
            const reponseCodesFile = `${enumeration.Directory}/ResponseCodes-${enumeration.Scope.toUpperCase()}.txt`;
            const newReponseCodesFile = `${enumeration.Directory}/NewResponseCodes-${enumeration.Scope.toUpperCase()}-${date}.txt`;
            const auxNewResponseCodesFile = `${enumeration.Directory}/AuxNewResponseCodes-${enumeration.Scope.toUpperCase()}-${date}.txt`;
            
            const hakcheckurl = `cat ${this.allAlivesFile} | ${GO_DIR}hakcheckurl | tee -a ${auxNewResponseCodesFile}`;

            var firstExecution = false;

            enumeration.Syntax = hakcheckurl;
            
            client.emit('completed-scan', {
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

            client.emit('completed-scan', {
                success: true,
                executing: false,
                msg: `Response Code scanning executed Succesfully...`
            });


        } else {
            client.emit('completed-scan', {
                success: false,
                executing: false,
                msg: `Loading results, please try again...`
            });
        }


    } catch (e) {
        console.error(e);
    }
}

async function ExecuteWaybackurl(payload, client) {
    try {

        const program = await Program.findOne({Url: payload.Url});

        if(!program){
            client.emit('completed-scan', {
                success: false,
                executing: false,
                msg: `Doesn't exist program with this URL.`
            });
        }

        const discovery = new Discoveries({
            Directory: CreateWaybackurlDirectory(program),
            Scope: payload.Scope,
            Program: program._id,
            Type: 1, // Tipo 1 = Waybackurls.
            Executed: false
        });

        if(discovery){
            var firstExecution = false;
            let allWaybackurlsFile = `${discovery.Directory}/Waybackurls-${discovery.Scope.toUpperCase()}.txt`;
            let newWaybackurlsFile = `${discovery.Directory}/NewWaybackurls-${discovery.Scope.toUpperCase()}-${date}.txt`;
            let auxNewWaybackurlsFile = `${discovery.Directory}/AuxNewWaybackurls-${discovery.Scope.toUpperCase()}-${date}.txt`;
    
            /* SINTAXIS DE CADA HERRAMIENTA */            
            const waybackurl = `cat ${this.allAlivesFile} | ${GO_DIR}waybackurls | tee -a ${auxNewWaybackurlsFile}`;
            
            discovery.Syntax = [waybackurl];
            
            client.emit('completed-scan', {
                success: true,
                executing: true,
                msg: `Executing Waybackurls for all Alive Subdomains on ${discovery.Scope}...`
            });
                
            shell.exec(waybackurl); //Ejecuto Httprobe
    
            if(!fs.existsSync(allWaybackurlsFile)){
                fs.appendFileSync(allWaybackurlsFile, '', (err) => {
                    if (err) {
                        return fs.appendFileSync(`${discovery.Directory}/Error.txt`, err);
                    }
                });

                firstExecution = true;
                shell.exec(`cat ${auxNewWaybackurlsFile} >> ${allWaybackurlsFile}`); 
            }
        
            shell.exec(`awk 'NR == FNR{ a[$0] = 1;next } !a[$0]' ${allWaybackurlsFile} ${auxNewWaybackurlsFile} >> ${newWaybackurlsFile}`); //Se utiliza para monitoreo
            shell.exec(`rm -r ${auxNewWaybackurlsFile}`); //Elimino txt auxiliar.
    
            shell.exec(`cat ${newWaybackurlsFile} >> ${allWaybackurlsFile}`);
    
            discovery.NewFile = newWaybackurlsFile; // Guardo New Waybackurl / Monitoreo..
            discovery.File = allWaybackurlsFile; // Guardo File.
            discovery.Executed = true; //Cambio estado a Executed.
            discovery.save();
    
            let Results = FileToArray(newWaybackurlsFile);
    
            const monitoring = new Monitorings({
                Program: discovery.Program,
                Scope: discovery.Scope,
                Type: 6,
                Results: Results
            });
    
            program.Files.push(allWaybackurlsFile);
    
            if(firstExecution){
    
                let Results = FileToArray(allWaybackurlsFile);

                monitoring.Results = Results;
    
                Results.forEach(element => {
                    if(element.length !== 0){
                        program.Waybackurls.push(element);
                    }
                });

            } else {
                Results.forEach(element => {
                    if(element.length !== 0){
                        program.Waybackurls.push(element);
                    }
                });
            }
    
            monitoring.save();
            program.save();
    
            client.emit('completed-scan', {
                success: true,
                executing: false,
                msg: `Waybackurls executed Succesfully...`
            });
        } else {
            client.emit('completed-scan', {
                success: false,
                executing: false,
                msg: `Loading results, please try again...`
            });
        }


    } catch (e) {
        console.error(e);
    }
}

async function ExecuteGoSpider(payload, client) {
    try {

        const program = await Program.findOne({Url: payload.Url});

        if(!program){
            client.emit('completed-scan', {
                success: false,
                executing: false,
                msg: `Doesn't exist program with this URL.`
            });
        }

        const discovery = new Discoveries({
            Directory: CreateSpiderDirectory(program),
            Scope: payload.Scope,
            Program: program._id,
            Type: 3, // Tipo 3 = Gospider.
            Executed: false
        });
    
        if(discovery){
            var firstExecution = false;
            let allGoSpiderFile = `${discovery.Directory}/GoSpider-${discovery.Scope.toUpperCase()}.txt`;
            let newGoSpiderFile = `${discovery.Directory}/NewGoSpider-${discovery.Scope.toUpperCase()}-${date}.txt`;
            let auxNewGoSpiderFile = `${discovery.Directory}/AuxNewGoSpider-${discovery.Scope.toUpperCase()}-${date}`;
    
            /* SINTAXIS DE LA HERRAMIENTA */            
            const goSpider = `${GO_DIR}gospider -S ${this.allAlivesFile} -d 0 --sitemap -t 3 | tee -a ${auxNewGoSpiderFile}`;
            
            discovery.Syntax = [goSpider];
            
            client.emit('completed-scan', {
                success: true,
                executing: true,
                msg: `Executing GoSpider for all Alive Subdomains on ${discovery.Scope}...`
            });
                
            shell.exec(goSpider); //Ejecuto Httprobe
    
            if(!fs.existsSync(allGoSpiderFile)){
                fs.appendFileSync(allGoSpiderFile, '', (err) => {
                    if (err) {
                        return fs.appendFileSync(`${discovery.Directory}/Error.txt`, err);
                    }
                });

                firstExecution = true;
                shell.exec(`cat ${auxNewGoSpiderFile} >> ${allGoSpiderFile}`); 
            }
        
            shell.exec(`awk 'NR == FNR{ a[$0] = 1;next } !a[$0]' ${allGoSpiderFile} ${auxNewGoSpiderFile} >> ${newGoSpiderFile}`); //Se utiliza para monitoreo
            shell.exec(`rm -r ${auxNewGoSpiderFile}`); //Elimino txt auxiliar.
    
            shell.exec(`cat ${newGoSpiderFile} >> ${allGoSpiderFile}`);
    
            discovery.NewFile = newGoSpiderFile; // Guardo New GoSpider / Monitoreo..
            discovery.File = allGoSpiderFile; // Guardo File.
            discovery.Executed = true; //Cambio estado a Executed.
            discovery.save();
    
            let Results = FileToArray(newGoSpiderFile);
    
            const monitoring = new Monitorings({
                Program: discovery.Program,
                Scope: discovery.Scope,
                Type: 8,
                Results: Results
            });
    
            program.Files.push(allGoSpiderFile);
    
            if(firstExecution){
    
                let Results = FileToArray(allGoSpiderFile);

                monitoring.Results = Results;
    
                Results.forEach(element => {
                    if(element.length !== 0){
                        program.GoSpider.push(element);
                    }
                });

            } else {
                Results.forEach(element => {
                    if(element.length !== 0){
                        program.GoSpider.push(element);
                    }
                });
            }
    
            monitoring.save();
            program.save();

            client.emit('completed-scan', {
                success: true,
                executing: false,
                msg: `GoSpider executed Succesfully...`
            });
        } else {
            client.emit('completed-scan', {
                success: false,
                executing: false,
                msg: `Loading results, please try again...`
            });
        }


    } catch (e) {
        console.error(e);
    }
}

async function ExecuteHakrawler(payload, client) {
    try {

        const program = await Program.findOne({Url: payload.Url});

        if(!program){
            client.emit('completed-scan', {
                success: false,
                executing: false,
                msg: `Doesn't exist program with this URL.`
            });
        }

        const discovery = new Discoveries({
            Directory: CreateSpiderDirectory(program),
            Scope: payload.Scope,
            Program: program._id,
            Type: 5, // Tipo 5 = Hakrawler.
            Executed: false
        });

        if(discovery){
            var firstExecution = false;
            let allHakrawlerFile = `${discovery.Directory}/Hakrawler-${discovery.Scope.toUpperCase()}.txt`;
            let newHakrawlerFile = `${discovery.Directory}/NewHakrawler-${discovery.Scope.toUpperCase()}-${date}.txt`;
            let auxNewHakrawlerFile = `${discovery.Directory}/AuxNewHakrawler-${discovery.Scope.toUpperCase()}-${date}`;
    
            /* SINTAXIS DE LA HERRAMIENTA */            
            const hakrawler = `cat ${this.allAlivesFile} | ${GO_DIR}hakrawler -depth 2 -plain | tee -a ${auxNewHakrawlerFile}`;
            
            discovery.Syntax = [hakrawler];
            
            client.emit('completed-scan', {
                success: true,
                executing: true,
                msg: `Executing Hakrawler for all Alive Subdomains on ${discovery.Scope}...`
            });
                
            shell.exec(hakrawler); //Ejecuto Hakrawler
    
            if(!fs.existsSync(allHakrawlerFile)){
                fs.appendFileSync(allHakrawlerFile, '', (err) => {
                    if (err) {
                        return fs.appendFileSync(`${discovery.Directory}/Error.txt`, err);
                    }
                });

                firstExecution = true;
                shell.exec(`cat ${auxNewHakrawlerFile} >> ${allHakrawlerFile}`); 
            }
        
            shell.exec(`awk 'NR == FNR{ a[$0] = 1;next } !a[$0]' ${allHakrawlerFile} ${auxNewHakrawlerFile} >> ${newHakrawlerFile}`); //Se utiliza para monitoreo
            shell.exec(`rm -r ${auxNewHakrawlerFile}`); //Elimino txt auxiliar.
    
            shell.exec(`cat ${newHakrawlerFile} >> ${allHakrawlerFile}`);
    
            discovery.NewFile = newHakrawlerFile; // Guardo New Hakrawler / Monitoreo..
            discovery.File = allHakrawlerFile; // Guardo File.
            discovery.Executed = true; //Cambio estado a Executed.
            discovery.save();
    
            let Results = FileToArray(newHakrawlerFile);
    
            const monitoring = new Monitorings({
                Program: discovery.Program,
                Scope: discovery.Scope,
                Type: 10,
                Results: Results
            });
    
            program.Files.push(allHakrawlerFile);
    
            if(firstExecution){
    
                let Results = FileToArray(allHakrawlerFile)
                monitoring.Results = Results;
    
                Results.forEach(element => {
                    if(element.length !== 0){
                        program.Hakrawler.push(element);
                    }
                });

            } else {
                Results.forEach(element => {
                    if(element.length !== 0){
                        program.Hakrawler.push(element);
                    }
                });
            }
    
            monitoring.save();
            program.save();
    
            client.emit('completed-scan', {
                success: true,
                executing: false,
                msg: `Hakrawler executed Succesfully...`
            });
        } else {
            client.emit('completed-scan', {
                success: false,
                executing: false,
                msg: `Loading results, please try again...`
            });
        }

    } catch(e) {
        console.error(e);
    }
}

async function ExecuteDirsearch(program, payload, client) {
    try {

        const discovery = new Discoveries({
            Directory: CreateBruteforcingDirectory(program),
            Scope: payload.Scope,
            Program: program._id,
            Type: 7, // Tipo 7 = Dirsearch.
            Executed: false
        });

        if(discovery){
            var firstExecution = false;
            let allDirsearchFile = `${discovery.Directory}/Dirsearch-${discovery.Scope.toUpperCase()}.txt`;
            let newDirsearchFile = `${discovery.Directory}/NewDirsearch-${discovery.Scope.toUpperCase()}-${date}.txt`;
            let auxNewDirsearchFile = `${discovery.Directory}/AuxNewDirsearch-${discovery.Scope.toUpperCase()}-${date}.txt`;
    
            /* SINTAXIS DE CADA HERRAMIENTA */            
            const dirsearch = `python3 ${TOOLS_DIR}dirsearch/dirsearch.py -L ${this.allAlivesFile} -w ${LIST_DIR}${list} -e html,js,php,png,jpg,sql,json,xml,htm,css,asp,jsp,aspx,jspx,git -x 404 -t 50 -b --plain-text-report=${auxNewDirsearchFile}`;
            
            discovery.Syntax = [dirsearch];
            
            client.emit('completed-scan', {
                success: true,
                executing: true,
                msg: `Executing Dirsearch for all Alive Subdomains on ${discovery.Scope}...`
            });
                
            shell.exec(dirsearch); //Ejecuto Dirsearch
    
            if(!fs.existsSync(allDirsearchFile)){
                fs.appendFileSync(allDirsearchFile, '', (err) => {
                    if (err) {
                        return fs.appendFileSync(`${discovery.Directory}/Error.txt`, err);
                    }
                });

                firstExecution = true;
                shell.exec(`cat ${auxNewDirsearchFile} >> ${allDirsearchFile}`); 
            }
        
            shell.exec(`awk 'NR == FNR{ a[$0] = 1;next } !a[$0]' ${allDirsearchFile} ${auxNewDirsearchFile} >> ${newDirsearchFile}`); //Se utiliza para monitoreo
            shell.exec(`rm -r ${auxNewDirsearchFile}`); //Elimino txt auxiliar.
    
            shell.exec(`cat ${newDirsearchFile} >> ${allDirsearchFile}`);
    
            discovery.NewFile = newDirsearchFile; // Guardo NewDirsearch / Monitoreo..
            discovery.File = allDirsearchFile; // Guardo File.
            discovery.Executed = true; //Cambio estado a Executed.
            discovery.save();
    
            let Results = FileToArray(newDirsearchFile);
    
            const monitoring = new Monitorings({
                Program: discovery.Program,
                Scope: discovery.Scope,
                Type: 12,
                Results: Results
            });
    
            program.Files.push(allDirsearchFile);
    
            if(firstExecution){
    
                let Results = FileToArray(allDirsearchFile);

                monitoring.Results = Results;
    
                Results.forEach(element => {
                    if(element.length !== 0){
                        program.Hakrawler.push(element);
                    }
                });

            } else {
                Results.forEach(element => {
                    if(element.length !== 0){
                        program.Hakrawler.push(element);
                    }
                });
            }
    
            monitoring.save();
            program.save();
    
            client.emit('completed-scan', {
                success: true,
                executing: false,
                msg: `Dirsearch executed Succesfully...`
            });
        } else {
            client.emit('completed-scan', {
                success: false,
                executing: false,
                msg: `Loading results, please try again...`
            });
        }
    } catch (e) {
        console.error(e);
    }
}

function CreateEnumerationDirectory(Program){

    const ENUMERATION_DIR = `${Program.Directory}Enumeration/`;

    if(!fs.existsSync(ENUMERATION_DIR) ){
        shell.exec(`mkdir ${ENUMERATION_DIR}`);
    }

    return ENUMERATION_DIR;
}

function CreateAliveDirectory(Program){

    const ALIVE_DIR = `${Program.Directory}Alive`;

    if(!fs.existsSync(ALIVE_DIR) ){
        shell.exec(`mkdir ${ALIVE_DIR}`);
    }
    
    return ALIVE_DIR;
}

function CreateSubdomainEnumerationDirectory(Program){

    const SUB_ENUMERATION_DIR = `${CreateEnumerationDirectory(Program)}Subdomains`;

    if(!fs.existsSync(SUB_ENUMERATION_DIR) ){
        shell.exec(`mkdir ${SUB_ENUMERATION_DIR}`);
    }
    
    return SUB_ENUMERATION_DIR;
}

function CreateResponseCodesDirectory(Program){

    const RESPONSE_CODES_DIR = `${CreateEnumerationDirectory(Program)}ResponseCodes`;

    if(!fs.existsSync(RESPONSE_CODES_DIR) ){
        shell.exec(`mkdir ${RESPONSE_CODES_DIR}`);
    }
    
    return RESPONSE_CODES_DIR;
}

function CreateScreenshotDirectory(Program, Scope){

    const SCREENSHOT_DIR = `${Program.PathDirectory}Screenshots/`;

    if(!fs.existsSync(SCREENSHOT_DIR) ){
        shell.exec(`mkdir ${SCREENSHOT_DIR}`);
    }

    const SCREENSHOT_SCOPE_DIR = `${SCREENSHOT_DIR}${Scope.toUpperCase()}`;

    if(!fs.existsSync(SCREENSHOT_SCOPE_DIR) ){
        shell.exec(`mkdir ${SCREENSHOT_SCOPE_DIR}`);
    }
    
    return SCREENSHOT_SCOPE_DIR;
}

function CreateDiscoveryDirectory(Program){

    const DISCOVERY_DIR = `${Program.Directory}Discovery/`;

    if(!fs.existsSync(DISCOVERY_DIR) ){
        shell.exec(`mkdir ${DISCOVERY_DIR}`);
    }

    return DISCOVERY_DIR;
}

function CreateWaybackurlDirectory(Program){

    const WAYBACKURL_DIR = `${CreateDiscoveryDirectory(Program)}Waybackurls`;

    if(!fs.existsSync(WAYBACKURL_DIR) ){
        shell.exec(`mkdir ${WAYBACKURL_DIR}`);
    }
    
    return WAYBACKURL_DIR;
}

function CreateSpiderDirectory(Program){

    const SPIDER_DIR = `${CreateDiscoveryDirectory(Program)}Spider`;

    if(!fs.existsSync(SPIDER_DIR) ){
        shell.exec(`mkdir ${SPIDER_DIR}`);
    }
    
    return SPIDER_DIR;
}

function CreateBruteforcingDirectory(Program){

    const BRUTEF_DIR = `${CreateDiscoveryDirectory(Program)}Bruteforcing`;

    if(!fs.existsSync(BRUTEF_DIR) ){
        shell.exec(`mkdir ${BRUTEF_DIR}`);
    }
    
    return BRUTEF_DIR;
}


function FileToArray(file){

    let fileToArray = [];

    fileToArray = fs.readFileSync(file, {encoding: 'utf-8'}).split('\n');
    
    return fileToArray;
}
