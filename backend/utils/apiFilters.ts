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
}

export default APIFilters;
