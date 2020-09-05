exports.PaginatedResultsByScope = async (model, page, limit, scope, filter) => {
    try{
        const results = {}  

        if(scope){
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            results.results = model.slice(startIndex, endIndex)

            queryModel = model.filter((data) => data.toLowerCase().indexOf(scope.toLowerCase()) > -1).filter((data) => data.toLowerCase().indexOf(filter.toLowerCase()) > -1);
            results.results = queryModel.slice(startIndex, endIndex);
            
            if(endIndex < queryModel.length)        
            results.nextPage = {
                page: page+1,
                limit: limit
            }
        
            if(startIndex > 0){
                results.previousPage = {
                    page: page-1,
                    limit: limit
                }
            }

            results.totalPages = Math.ceil(queryModel.length/limit);
            results.actualPage = page;

        }

        return results;

    } catch (e){
        throw e;
    }
}

exports.PaginatedResponseCodesByScope = async (model, page, limit, scope, filter) => {
    try{
        const results = {}  

        if(scope){
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            results.results = model.slice(startIndex, endIndex)

            queryModel = model.filter((data) => data.Subdomain.toLowerCase().indexOf(scope.toLowerCase()) > -1).filter((data) => data.Subdomain.toLowerCase().indexOf(filter.toLowerCase()) > -1);
            results.results = queryModel.slice(startIndex, endIndex);
            
            if(endIndex < queryModel.length)        
            results.nextPage = {
                page: page+1,
                limit: limit
            }
        
            if(startIndex > 0){
                results.previousPage = {
                    page: page-1,
                    limit: limit
                }
            }

            results.totalPages = Math.ceil(queryModel.length/limit);
            results.actualPage = page;

        }

        return results;

    } catch (e){
        throw e;
    }
}

exports.PaginatedMonitoringResults = async (model, page, limit, filter) => {
    try{
        const results = {}  

        if(model) {
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            results.results = model.slice(startIndex, endIndex);

            queryModel = model.filter((data) => data.toLowerCase()).filter((data) => data.toLowerCase().indexOf(filter.toLowerCase()) > -1);
            results.results = queryModel.slice(startIndex, endIndex);
            
            if(endIndex < queryModel.length)        
            results.nextPage = {
                page: page+1,
                limit: limit
            }
        
            if(startIndex > 0){
                results.previousPage = {
                    page: page-1,
                    limit: limit
                }
            }

            results.totalPages = Math.ceil(queryModel.length/limit);
            results.actualPage = page;

            return results;
        }

    } catch (e){
        throw e;
    }
}