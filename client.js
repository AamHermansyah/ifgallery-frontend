import sanityClient from '@sanity/client';

const config = {
    projectId: 'dax3ptdl',
    dataset: 'production',
    apiVersion: '2022-11-02',
    useCdn:  true,
    token: 'skpMndGoLpupT6JVZqdPAJgHzgyrWAWUFpGKVklf5Dh1nglOqXLYFZnocmTei15eIaRveF5mwfWIRBB2hSfAFz7SYS7VyqTXlzyNRC6ggC34v96r7HxS30Oo35vjRtiaRR8TPIf7kkraPQ6LX8tBtGQ2Uhd2TO0k5wyudo1uIaBKpYurKkdY'
}

export const client = sanityClient(config)