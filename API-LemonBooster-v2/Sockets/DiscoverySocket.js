require('dotenv').config({path: '.env'});
const shell = require('shelljs');
const fs = require('fs');
const dateFormat = require('dateformat');

const Enumeration = require('../Models/Enumerations');
const Program = require('../Models/Programs');
const Monitorings = require('../Models/Monitorings');
const Discoveries = require('../Models/Discoveries');

const date = dateFormat(new Date(), "yyyy-mm-dd-HH-MM");

const GO_DIR=`${process.env.GO_DIR}`;
const TOOLS_DIR=`${process.env.TOOLS_DIR}`;
const LIST_DIR=`${process.env.LIST_DIR}`;


ExecuteWaybackurlsAll = (client) => {
    client.on('execute-waybackurls-all', async (payload) => {
        try {
            const id = payload.Waybackurls._id;
            const discovery = await Discoveries.findById(id).exec();
    
            if(discovery){
                var firstExecution = false;
                let allWaybackurlsFile = `${discovery.Directory}/Waybackurls-${discovery.Scope.toUpperCase()}.txt`;
                let newWaybackurlsFile = `${discovery.Directory}/NewWaybackurls-${discovery.Scope.toUpperCase()}-${date}.txt`;
                let auxNewWaybackurlsFile = `${discovery.Directory}/AuxNewWaybackurls-${discovery.Scope.toUpperCase()}-${date}.txt`;
        
                /* SINTAXIS DE CADA HERRAMIENTA */            
                const waybackurl = `cat ${payload.Alives.File} | ${GO_DIR}waybackurls | tee -a ${auxNewWaybackurlsFile}`;
                
                discovery.Syntax = [waybackurl];
                discovery.PathDirectory = payload.Waybackurls.Program.PathDirectory;
                
                client.emit('executed-waybackurls', {
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
        
                const program = await Program.findById(payload.Waybackurls.Program);
        
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
        
                client.emit('executed-waybackurls', {
                    success: true,
                    executing: false,
                    msg: `Waybackurls executed Succesfully...`
                });
            } else {
                client.emit('executed-waybackurls', {
                    success: false,
                    executing: false,
                    msg: `Something wrong, please refresh or try again...`
                });
            }
        } catch (e) {
            console.error(e);
        }
    });
}

ExecuteWaybackurlsBySubdomain = (client) => {
    client.on('execute-waybackurls', async (payload) => {
        try {
            const id = payload.Waybackurls._id;
            const discovery = await Discoveries.findById(id).exec();
    
            if(discovery){
                let subdomain = discovery.Subdomain.split('://');
                let allWaybackurlsFile = `${discovery.Directory}/SubdomainWaybackurl-${subdomain[0].toUpperCase()}-${subdomain[1].toUpperCase()}.txt`;
                let newWaybackurlsFile = `${discovery.Directory}/NewSubdomainWaybackurl-${subdomain[0].toUpperCase()}-${subdomain[1].toUpperCase()}-${date}.txt`;
                let auxNewWaybackurlsFile = `${discovery.Directory}/AuxNewSubdomainWaybackurl-${subdomain[0].toUpperCase()}-${subdomain[1].toUpperCase()}-${date}.txt`;
        
                /* SINTAXIS DE CADA HERRAMIENTA */            
                const waybackurl = `echo ${discovery.Subdomain} | ${GO_DIR}waybackurls | tee -a ${auxNewWaybackurlsFile}`;
                
                discovery.Syntax = [waybackurl];
                discovery.PathDirectory = payload.Waybackurls.Program.PathDirectory;
                
                client.emit('executed-waybackurls', {
                    success: true,
                    executing: true,
                    msg: `Executing Waybackurl for Subdomain: ${discovery.Subdomain}...`
                });
                    
                shell.exec(waybackurl); //Ejecuto Httprobe
        
                if(!fs.existsSync(allWaybackurlsFile)){
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
                    Type: 7,
                    Results: Results
                });
        
                const program = await Program.findById(payload.Waybackurls.Program);
        
                program.Files.push(allWaybackurlsFile);
        
                monitoring.save();
                program.save();
        
                client.emit('executed-waybackurls', {
                    success: true,
                    executing: false,
                    msg: `Waybackurl executed Succesfully...`
                });
            } else {
                client.emit('executed-waybackurls', {
                    success: false,
                    executing: false,
                    msg: `Something wrong, please refresh or try again...`
                });
            }
        } catch (e) {
            console.error(e);
        }
    });
}

ExecuteGoSpiderAll = (client) => {
    client.on('execute-gospider-all', async (payload) => {
        try {
            const id = payload.GoSpider._id;
            const discovery = await Discoveries.findById(id).exec();
    
            if(discovery){
                var firstExecution = false;
                let allGoSpiderFile = `${discovery.Directory}/GoSpider-${discovery.Scope.toUpperCase()}.txt`;
                let newGoSpiderFile = `${discovery.Directory}/NewGoSpider-${discovery.Scope.toUpperCase()}-${date}.txt`;
                let auxNewGoSpiderFile = `${discovery.Directory}/AuxNewGoSpider-${discovery.Scope.toUpperCase()}-${date}`;
                // let auxNewGoSpiderFile = `${discovery.Directory}/AuxNewGoSpider-${discovery.Scope.toUpperCase()}-${date}.txt`;
        
                /* SINTAXIS DE LA HERRAMIENTA */            
                const goSpider = `${GO_DIR}gospider -S ${payload.Alives.File} -d 0 --sitemap -t 3 | tee -a ${auxNewGoSpiderFile}`;
                
                discovery.Syntax = [goSpider];
                discovery.PathDirectory = payload.GoSpider.Program.PathDirectory;
                
                client.emit('executed-gospider', {
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
        
                const program = await Program.findById(payload.GoSpider.Program);
        
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
        
                client.emit('executed-gospider', {
                    success: true,
                    executing: false,
                    msg: `GoSpider executed Succesfully...`
                });
            } else {
                client.emit('executed-gospider', {
                    success: false,
                    executing: false,
                    msg: `Something wrong, please refresh or try again...`
                });
            }
        } catch (e) {
            console.error(e);
        }
    });
}

ExecuteGoSpiderBySubdomain = (client) => {
    client.on('execute-gospider', async (payload) => {
        try {
            const id = payload.GoSpider._id;
            const discovery = await Discoveries.findById(id).exec();
    
            if(discovery){
                let subdomain = discovery.Subdomain.split('://');
                let allGoSpiderFile = `${discovery.Directory}/SubdomainGoSpider-${subdomain[0].toUpperCase()}-${subdomain[1].toUpperCase()}.txt`;
                let newGoSpiderFile = `${discovery.Directory}/NewSubdomainGoSpider-${subdomain[0].toUpperCase()}-${subdomain[1].toUpperCase()}-${date}.txt`;
                let auxNewGoSpiderFile = `${discovery.Directory}/AuxNewSubdomainGoSpider-${subdomain[0].toUpperCase()}-${subdomain[1].toUpperCase()}-${date}.txt`;
        
                /* SINTAXIS DE CADA HERRAMIENTA */            
                const goSpider = `${GO_DIR}gospider -s ${discovery.Subdomain} -d 0 --sitemap -t 3 | tee -a ${auxNewGoSpiderFile}`;
                
                discovery.Syntax = [goSpider];
                discovery.PathDirectory = payload.GoSpider.Program.PathDirectory;
                
                client.emit('executed-gospider', {
                    success: true,
                    executing: true,
                    msg: `Executing GoSpider for Subdomain: ${discovery.Subdomain}...`
                });
                    
                shell.exec(goSpider); //Ejecuto Httprobe
        
                if(!fs.existsSync(allGoSpiderFile)){
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
                    Type: 9,
                    Results: Results
                });
        
                const program = await Program.findById(payload.GoSpider.Program);
        
                program.Files.push(allGoSpiderFile);
        
                monitoring.save();
                program.save();
        
                client.emit('executed-gospider', {
                    success: true,
                    executing: false,
                    msg: `GoSpider executed Succesfully...`
                });
            } else {
                client.emit('executed-gospider', {
                    success: false,
                    executing: false,
                    msg: `Something wrong, please refresh or try again...`
                });
            }
        } catch (e) {
            console.error(e);
        }
    });
}

ExecuteHakrawlerAll = (client) => {
    client.on('execute-hakrawler-all', async (payload) => {
        try {
            const id = payload.Hakrawler._id;
            const discovery = await Discoveries.findById(id).exec();
    
            if(discovery){
                var firstExecution = false;
                let allHakrawlerFile = `${discovery.Directory}/Hakrawler-${discovery.Scope.toUpperCase()}.txt`;
                let newHakrawlerFile = `${discovery.Directory}/NewHakrawler-${discovery.Scope.toUpperCase()}-${date}.txt`;
                let auxNewHakrawlerFile = `${discovery.Directory}/AuxNewHakrawler-${discovery.Scope.toUpperCase()}-${date}`;
        
                /* SINTAXIS DE LA HERRAMIENTA */            
                const hakrawler = `cat ${payload.Alives.File} | ${GO_DIR}hakrawler -depth 2 -plain | tee -a ${auxNewHakrawlerFile}`;
                
                discovery.Syntax = [hakrawler];
                discovery.PathDirectory = payload.Hakrawler.Program.PathDirectory;
                
                client.emit('executed-hakrawler', {
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
        
                const program = await Program.findById(payload.Hakrawler.Program);
        
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
        
                client.emit('executed-hakrawler', {
                    success: true,
                    executing: false,
                    msg: `Hakrawler executed Succesfully...`
                });
            } else {
                client.emit('executed-hakrawler', {
                    success: false,
                    executing: false,
                    msg: `Something wrong, please refresh or try again...`
                });
            }
        } catch (e) {
            console.error(e);
        }
    });
}

ExecuteHakrawlerBySubdomain = (client) => {
    client.on('execute-hakrawler', async (payload) => {
        try {
            const id = payload.Hakrawler._id;
            const discovery = await Discoveries.findById(id).exec();
    
            if(discovery){
                let subdomain = discovery.Subdomain.split('://');
                let allHakrawlerFile = `${discovery.Directory}/SubdomainHakrawler-${subdomain[0].toUpperCase()}-${subdomain[1].toUpperCase()}.txt`;
                let newHakrawlerFile = `${discovery.Directory}/NewSubdomainHakrawler-${subdomain[0].toUpperCase()}-${subdomain[1].toUpperCase()}-${date}.txt`;
                let auxNewHakrawlerFile = `${discovery.Directory}/AuxNewSubdomainHakrawler-${subdomain[0].toUpperCase()}-${subdomain[1].toUpperCase()}-${date}.txt`;
        
                /* SINTAXIS DE CADA HERRAMIENTA */            
                const hakrawler = `echo ${discovery.Subdomain} | ${GO_DIR}hakrawler -plain -depth 3 | tee -a ${auxNewHakrawlerFile}`;
                
                discovery.Syntax = [hakrawler];
                discovery.PathDirectory = payload.Hakrawler.Program.PathDirectory;
                
                client.emit('executed-hakrawler', {
                    success: true,
                    executing: true,
                    msg: `Executing Hakrawler for Subdomain: ${discovery.Subdomain}...`
                });
                    
                shell.exec(hakrawler); //Ejecuto Httprobe
        
                if(!fs.existsSync(allHakrawlerFile)){
                    shell.exec(`cat ${auxNewHakrawlerFile} >> ${allHakrawlerFile}`); 
                }
            
                shell.exec(`awk 'NR == FNR{ a[$0] = 1;next } !a[$0]' ${allHakrawlerFile} ${auxNewHakrawlerFile} >> ${newHakrawlerFile}`); //Se utiliza para monitoreo
                shell.exec(`rm -r ${auxNewHakrawlerFile}`); //Elimino txt auxiliar.
        
                shell.exec(`cat ${newHakrawlerFile} >> ${allHakrawlerFile}`);
        
                discovery.NewFile = newHakrawlerFile; // Guardo New GoSpider / Monitoreo..
                discovery.File = allHakrawlerFile; // Guardo File.
                discovery.Executed = true; //Cambio estado a Executed.
                discovery.save();
        
                let Results = FileToArray(newHakrawlerFile);
        
                const monitoring = new Monitorings({
                    Program: discovery.Program,
                    Scope: discovery.Scope,
                    Type: 11,
                    Results: Results
                });
        
                const program = await Program.findById(payload.Hakrawler.Program);
        
                program.Files.push(allHakrawlerFile);
        
                monitoring.save();
                program.save();
        
                client.emit('executed-hakrawler', {
                    success: true,
                    executing: false,
                    msg: `Hakrawler executed Succesfully...`
                });
            } else {
                client.emit('executed-hakrawler', {
                    success: false,
                    executing: false,
                    msg: `Something wrong, please refresh or try again...`
                });
            }
        } catch (e) {
            console.error(e);
        }
    });
}

ExecuteDirsearchAll = (client) => {
    client.on('execute-dirsearch-all', async (payload) => {
        try {
            const id = payload.Dirsearch._id;
            const list = payload.List;
            const discovery = await Discoveries.findById(id).exec();
    
            if(discovery){
                var firstExecution = false;
                let allDirsearchFile = `${discovery.Directory}/Dirsearch-${discovery.Scope.toUpperCase()}.txt`;
                let newDirsearchFile = `${discovery.Directory}/NewDirsearch-${discovery.Scope.toUpperCase()}-${date}.txt`;
                let auxNewDirsearchFile = `${discovery.Directory}/AuxNewDirsearch-${discovery.Scope.toUpperCase()}-${date}.txt`;
        
                /* SINTAXIS DE CADA HERRAMIENTA */            
                const dirsearch = `python3 ${TOOLS_DIR}dirsearch/dirsearch.py -L ${payload.Alives.File} -w ${LIST_DIR}${list} -e html,js,php,png,jpg,sql,json,xml,htm,css,asp,jsp,aspx,jspx,git -x 404 -t 50 -b --plain-text-report=${auxNewDirsearchFile}`;
                
                discovery.Syntax = [dirsearch];
                discovery.PathDirectory = payload.Dirsearch.Program.PathDirectory;
                
                client.emit('executed-dirsearch', {
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
        
                const program = await Program.findById(payload.Dirsearch.Program);
        
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
        
                client.emit('executed-dirsearch', {
                    success: true,
                    executing: false,
                    msg: `Dirsearch executed Succesfully...`
                });
            } else {
                client.emit('executed-dirsearch', {
                    success: false,
                    executing: false,
                    msg: `Something wrong, please refresh or try again...`
                });
            }
        } catch (e) {
            console.error(e);
        }
    });
}

ExecuteDirsearchBySubdomain = (client) => {
    client.on('execute-dirsearch', async (payload) => {
        try {
            const id = payload.Dirsearch._id;
            const list = payload.List;
            const discovery = await Discoveries.findById(id).exec();
    
            if(discovery){
                let subdomain = discovery.Subdomain.split('://');
                let allDirsearchFile = `${discovery.Directory}/SubdomainDirsearch-${subdomain[0].toUpperCase()}-${subdomain[1].toUpperCase()}.txt`;
                let newDirsearchFile = `${discovery.Directory}/NewSubdomainDirsearch-${subdomain[0].toUpperCase()}-${subdomain[1].toUpperCase()}-${date}.txt`;
                let auxNewDirsearchFile = `${discovery.Directory}/AuxNewSubdomainDirsearch-${subdomain[0].toUpperCase()}-${subdomain[1].toUpperCase()}-${date}.txt`;
        
                /* SINTAXIS DE CADA HERRAMIENTA */            
                const dirsearch = `python3 ${TOOLS_DIR}dirsearch/dirsearch.py -u ${discovery.Subdomain} -w ${LIST_DIR}${list} -e html,js,php,png,jpg,sql,json,xml,htm,css,asp,jsp,aspx,jspx,git -x 404 -t 50 -b --plain-text-report=${auxNewDirsearchFile}`;
                
                discovery.Syntax = [dirsearch];
                discovery.PathDirectory = payload.Dirsearch.Program.PathDirectory;
                
                client.emit('executed-dirsearch', {
                    success: true,
                    executing: true,
                    msg: `Executing Dirsearch for Subdomain: ${discovery.Subdomain}...`
                });
                    
                shell.exec(dirsearch); //Ejecuto Dirsearch
        
                if(!fs.existsSync(allDirsearchFile)){
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
                    Type: 13,
                    Results: Results
                });
        
                const program = await Program.findById(payload.Dirsearch.Program);
        
                program.Files.push(allDirsearchFile);
        
                monitoring.save();
                program.save();
        
                client.emit('executed-dirsearch', {
                    success: true,
                    executing: false,
                    msg: `Dirsearch executed Succesfully...`
                });
            } else {
                client.emit('executed-dirsearch', {
                    success: false,
                    executing: false,
                    msg: `Something wrong, please refresh or try again...`
                });
            }
        } catch (e) {
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
    ExecuteWaybackurlsAll,
    ExecuteWaybackurlsBySubdomain,
    ExecuteGoSpiderAll,
    ExecuteGoSpiderBySubdomain,
    ExecuteHakrawlerAll,
    ExecuteHakrawlerBySubdomain,
    ExecuteDirsearchAll,
    ExecuteDirsearchBySubdomain
}
