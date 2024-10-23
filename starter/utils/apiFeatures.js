class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    //1) FILTERING
    const queryObj = { ...this.queryStr }; //destructuring and creating a new object to avoid deleting the real one
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //2) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //regex
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // 3) Sorting
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy); //changin the query
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // 4) Field Limiting
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // 5) Pagination
    const page = this.queryStr.page * 1 || 1; //default value;
    const limit = this.queryStr.limit * 1 || 100;
    const skipVal = (page - 1) * limit;
    this.query = this.query.skip(skipVal).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
