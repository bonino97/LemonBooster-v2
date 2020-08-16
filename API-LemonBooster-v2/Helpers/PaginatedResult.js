exports.PaginatedResultsByScope = async (model, page, limit, scope, filter) => {
    try{
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {}  
        
        results.results = model.slice(startIndex, endIndex)
        
        if(scope){
            results.results = model.filter((data) => data.toLowerCase().indexOf(scope.toLowerCase()) > -1).filter((data) => data.toLowerCase().indexOf(filter.toLowerCase()) > -1).slice(startIndex, endIndex);
        }

        if(endIndex < model.length)        
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
        

        results.totalPages = Math.ceil(model.length/limit);
        results.actualPage = page;
        return results;

    } catch (e){
        throw e;
    }
}
