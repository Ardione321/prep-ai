class APIFilters {
  query: any;
  queryString: any;

  constructor(query: any, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryCopy = { ...this.queryString };

    const removeFields = ["page"];
    removeFields.forEach((element) => delete queryCopy[element]);

    this.query = this.query.find(queryCopy);

    return this;
  }

  pagination(resPerPage: number) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);

    return this;
  }

  sort() {
    this.query = this.query.sort("-createdAt");
    return this;
  }
}

export default APIFilters;
