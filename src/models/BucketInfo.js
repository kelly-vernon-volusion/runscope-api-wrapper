'use strict';

class BucketInfo{
  constructor(name, id, uri){
    this.name = name;
    this.id = id;
    this.uri = uri;
  }

  isNew(){
    return this.id === undefined || this.id === null || this.id === '';
  }

  haveSameId(bucketInfo){
    return this.id === bucketInfo.id;
  }
}

module.exports = BucketInfo;
