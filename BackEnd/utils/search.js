class Search {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        if (this.queryStr.keyword) {
            const keyword = {
                $or: [
                    { nameOfMedicine: { $regex: this.queryStr.keyword, $options: "i" } },
                    { firstName: { $regex: this.queryStr.keyword, $options: "i" } },
                    { lastName: { $regex: this.queryStr.keyword, $options: "i" } },
                    { email: { $regex: this.queryStr.keyword, $options: "i" } },
                    { contactNumber: { $regex: this.queryStr.keyword, $options: "i" } },
                    { address: { $regex: this.queryStr.keyword, $options: "i" } },
                    { role: { $regex: this.queryStr.keyword, $options: "i" } },
                ]
            };
            this.query = this.query.find({ ...keyword });
        }
        return this;
    }
};

module.exports = Search;
