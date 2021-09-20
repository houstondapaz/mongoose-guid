declare module 'mongoose' {
  namespace Schema {
    namespace Types {
      class Guid extends SchemaType {}
    }
  }
  namespace Types {
    class Guid extends SchemaType {}
  }
}
