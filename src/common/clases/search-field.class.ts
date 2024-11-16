export default class SearchField<T> {
  field: keyof T & string;
}
