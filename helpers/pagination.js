const pagination = {
    initQueryArray: function (queries, defaultValues) {
        let qArr = new Array();

        if (Array.isArray(queries))
            for (const q of queries) {
                qArr.push(q);
            }
        else if (queries) qArr.push(queries);
        else
            for (const dv of defaultValues) {
                qArr.push(dv);
            }

        return qArr;
    },

    createQueryLink: function (queryArray, inputName) {
        let link = '';

        for (let i = 0; i < queryArray.length; i++) {
            link += `${inputName}=${queryArray[i]}&`;
        }

        return link;
    },

    createPageLink: function (page, route, queryLinks) {
        var pageLink = `${route}?`;

        for (const ql of queryLinks) {
            pageLink += ql;
        }

        pageLink += `page=${page}`;

        return pageLink;
    },

    configSelectOptions: function (results, route, queryLinks) {
        let selectOptions = new Array();

        for (let i = 0; i < results.pages; i++) {
            let nPage = i + 1;

            let options = {
                pageLink: this.createPageLink(nPage, route, queryLinks),
                pageNo: nPage,
                isSelected: results.page == nPage,
            };

            selectOptions.push(options);
        }

        return selectOptions;
    },

    configPagination: function (results, route, queryLinks) {
        let o = {};

        o.selectOptions = this.configSelectOptions(results, route, queryLinks);

        let nextPageNumber = parseInt(results.page) + 1;
        let prevPageNumber = parseInt(results.page) - 1;

        o.prevPageLink =
            results.page != '1'
                ? this.createPageLink(prevPageNumber, route, queryLinks)
                : '';

        o.nextPageLink =
            results.page != results.pages
                ? this.createPageLink(nextPageNumber, route, queryLinks)
                : '';

        o.hasPrevPage = o.prevPageLink ? true : false;
        o.hasNextPage = o.nextPageLink ? true : false;

        return o;
    },
};

module.exports = pagination;
