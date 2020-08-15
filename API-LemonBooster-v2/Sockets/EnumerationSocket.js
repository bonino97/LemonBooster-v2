require('dotenv').config({path: '.env'});
const shell = require('shelljs');
const fs = require('fs');
const Enumeration = require('../Models/Enumerations');
const Program = require('../Models/Programs');
const dateFormat = require('dateformat');
const date = dateFormat(new Date(), "yyyy-mm-dd-HH-MM");

const GO_DIR=`${process.env.GO_DIR}`;



ExecuteSubdomainEnumeration = (client) => {
    client.on('execute-subdomain-enumeration', async (payload) => {
        const enumeration = await Enumeration.findById(payload._id);

        let allSubdomainsFile = `${enumeration.Directory}/AllSubdomains.txt`;

        let newSubdomainsFile = `${enumeration.Directory}/NewSubdomains-${date}.txt`;
        let auxNewSubdomainsFile = `${enumeration.Directory}/AuxNewSubdomains-${date}.txt`;


        let findomainFile = `${enumeration.Directory}/Findomain-${date}.txt`;
        let subfinderFile = `${enumeration.Directory}/Subfinder-${date}.txt`;
        let assetFinderFile = `${enumeration.Directory}/Assetfinder-${date}.txt`;
        
        if(!fs.existsSync(newSubdomainsFile)){
            fs.appendFileSync(newSubdomainsFile, '', (err) => {
                if (err) {
                    return fs.appendFileSync(`${enumeration.Directory}/Error.txt`, err);
                }
            });
        };

        if(!fs.existsSync(auxNewSubdomainsFile)){
            fs.appendFileSync(auxNewSubdomainsFile, '', (err) => {
                if (err) {
                    return fs.appendFileSync(`${enumeration.Directory}/Error.txt`, err);
                }
            });
        };

        /* SINTAXIS DE CADA HERRAMIENTA */
        const findomain = `findomain -t ${payload.Scope} -u ${findomainFile}`;
        const subfinder = `subfinder -d ${payload.Scope} -t 65 -timeout 15 -o ${subfinderFile}`;
        const assetFinder = `${GO_DIR}assetfinder --subs-only ${payload.Scope} | tee -a ${assetFinderFile}`; 

        enumeration.Syntax=[findomain,subfinder,assetFinder];

        client.emit('executed-subdomain-enumeration', {
            success: true,
            msg: `Executing Subdomain Enumeration on ${enumeration.Scope}...`
        });

        shell.exec(findomain); //Ejecuto Findomain
        shell.exec(subfinder); //Ejecuto Subfinder
        shell.exec(assetFinder); //Ejecuto Assetfinder

        shell.exec(`cat ${findomainFile} ${subfinderFile} ${assetFinderFile} >> ${auxNewSubdomainsFile}`); // Guardo todos los resultados en un Txt Auxiliar
        shell.exec(`sort -u ${auxNewSubdomainsFile} -o ${auxNewSubdomainsFile}`); // Ordeno y filtro resultados.

        if(!fs.existsSync(allSubdomainsFile)){
            fs.appendFileSync(allSubdomainsFile, '', (err) => {
                if (err) {
                    return fs.appendFileSync(`${enumeration.Directory}/Error.txt`, err);
                }
            });

            shell.exec(`cat ${auxNewSubdomainsFile} >> ${allSubdomainsFile}`); // Si no existe ningun archivo AllSubd inicializo con todos los encontrados.
        }
    
        shell.exec(`awk 'NR == FNR{ a[$0] = 1;next } !a[$0]' ${allSubdomainsFile} ${auxNewSubdomainsFile} >> ${newSubdomainsFile}`); // Filtro entre AllSubd y NewSub para luego armar un Txt de NuevosSubdominios a Monitorear.
        shell.exec(`rm -r ${auxNewSubdomainsFile} ${findomainFile} ${subfinderFile} ${assetFinderFile}`); //Elimino txts.
        shell.exec(`cat ${newSubdomainsFile} >> ${allSubdomainsFile}`); // Guardo todos los resultados en AllSubdomains.

        enumeration.Executed = true; //Cambio estado a Executed.
        enumeration.save();

        
    });
}

GetLastSubdomainEnumeration = (client) => {
    client.on('last-executed-subdomain-enumeration', async (payload) => {
        const program = await Program.findOne({});
    });
}

GetSubdomainEnumerationsList = (client) => {
    client.on('executed-subdomain-enumeration-list', async (payload) => {
        await Program.findOne({

        });
    });
}


module.exports = {
    ExecuteSubdomainEnumeration
}