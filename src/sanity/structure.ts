import type {StructureResolver} from 'sanity/structure'

// Singleton documents – one editable document of each, opened directly from the sidebar.
const SINGLETONS: { id: string; title: string }[] = [
  { id: 'siteSettings', title: 'Site Settings' },
]

// Types hidden from the Studio sidebar (content stays intact for references).
const HIDDEN_TYPES: string[] = []

const SINGLETON_IDS = SINGLETONS.map((s) => s.id)

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      ...SINGLETONS.map(({ id, title }) =>
        S.listItem()
          .title(title)
          .id(id)
          .child(S.document().schemaType(id).documentId(id))
      ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId()
        if (!id) return false
        return !HIDDEN_TYPES.includes(id) && !SINGLETON_IDS.includes(id)
      }),
    ])
