export class BucketInfo {
  constructor(name, id, uri, defaultEnvironmentId) {
    this.name = name;
    this.id = id;
    this.uri = uri;
    this.defaultEnvironmentId = defaultEnvironmentId;
  }

  isNew() {
    return this.id === undefined || this.id === null || this.id === '';
  }

  haveSameId(bucketInfo) {
    return this.id === bucketInfo.id;
  }
}

