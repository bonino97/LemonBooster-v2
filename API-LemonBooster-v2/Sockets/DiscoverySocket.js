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
        
                let Results = {
                    Type: 6,
                    Data: FileToArray(newWaybackurlsFile)
                }
        
                const monitoring = new Monitorings({
                    Program: discovery.Program,
                    Scope: discovery.Scope,
                    Results: Results
                });
        
                const program = await Program.findById(payload.Waybackurls.Program);
        
                program.Files.push(allWaybackurlsFile);
        
                if(firstExecution){
        
                    let Results = {
                        Type: 6,
                        Data: FileToArray(allWaybackurlsFile)
                    }

                    monitoring.Results = Results;
        
                    Results.Data.forEach(element => {
                        if(element.length !== 0){
                            program.Waybackurls.push(element);
                        }
                    });

                } else {
                    Results.Data.forEach(element => {
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
        
                let Results = {
                    Type: 7,
                    Data: FileToArray(newWaybackurlsFile)
                }
        
                const monitoring = new Monitorings({
                    Program: discovery.Program,
                    Scope: discovery.Scope,
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

function FileToArray(file){

    let fileToArray = [];

    fileToArray = fs.readFileSync(file, {encoding: 'utf-8'}).split('\n');
    
    return fileToArray;
}



module.exports = {
    ExecuteWaybackurlsAll,
    ExecuteWaybackurlsBySubdomain
}
