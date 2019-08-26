export default interface ItemModel {
    snippet: {
        thumbnails: {
            medium: {
                url: string
            }
        },
        title: string,
        channelTitle: string,
        publishedAt: string,
        description: string
    },
    id: {
        videoId: string
    },
    statistics: {
        viewCount: number
    }
}
