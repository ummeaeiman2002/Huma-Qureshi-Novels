import type {StructureResolver} from 'sanity/structure'

// Types hidden from the Studio sidebar (content stays intact for references).
const HIDDEN_TYPES = ['writer']

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items(
      S.documentTypeListItems().filter((item) => {
        const id = item.getId()
        return id ? !HIDDEN_TYPES.includes(id) : true
      })
    )
