module.exports = {
    platform: "Netease",
    author: "fuwutx",
    version: "0.1.0",
    appVersion: ">0.0.0",
    cacheControl: "no-store",
    primaryKey: ["id"],
    srcUrl: "https://yilong.eu.org/api/musicfree/netease.js",
    hints: {
        importMusicSheet: [
            "请输入id或url"
        ],
    },
    userVariables: [],
    supportedSearchType: [],
    // async search(query, page, type) {
    //     // 搜索的具体逻辑
    // },
    // 获取音乐的真实 url
    // async getMediaSource(mediaItem, quality) {
    //     // ...
    // },
    // 获取音乐详情
    // async getMusicInfo(musicItem) {
    //     // ...
    // },
    // 获取歌词
    // async getLyric(musicItem) {
    //     // ...
    // },
    // 获取专辑详情
    // async getAlbumInfo(albumItem, page) {
    //     // ...
    // },
    // // 获取歌单详情
    // async getMusicSheetInfo(sheetItem, page) {
    //     // ...
    // },
    // // 获取作者作品
    // async getArtistWorks(artistItem, page, type) {
    //     // ...
    // },
    // 导入单曲
    // async importMusicItem(urlLike) {
    //     // ...
    // },
    // 导入歌单
    async importMusicSheet(urlLike) {
        if (urlLike.startsWith("http")) {
            let id = urlLike.split("id=")[1];
            if (id) {
                urlLike = id;
            } else {
                return [];
            }
        }
        return fetch("https://v.iarc.top/playlist?type=playlist&id=" + urlLike)
            .then(res => res.json())
            .then(res => {
                return res.map(item => {
                    return {
                        // 媒体来源
                        platform: "Netease",
                        // 媒体ID
                        id: item.url.split("&id=")[1],
                        /** 作者 */
                        artist: item.artist,
                        /** 歌曲标题 */
                        title: item.name,

                        /** 默认音源 */
                        url: item.url,
                        /** 专辑封面图 */
                        artwork: item.pic,
                        /** 歌词URL */
                        lrc: item.lrc,
                    };
                });
            })
    },
    // 获取榜单列表
    async getTopLists() {
        return [
            {
                title: "推荐",
                data: [
                    {
                        id: "12610418982",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "推荐",
                    },
                ],
            },
            {
                title: "日系私人雷达",
                data: [
                    {
                        id: "3136952023",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "日系私人雷达",
                    },
                ],
            },
            {
                title: "韩系私人雷达",
                data: [
                    {
                        id: "2829920189",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "韩系私人雷达",
                    },
                ],
            },
            {
                title: "云音乐日语榜",
                data: [
                    {
                        id: "2829920189",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "云音乐日语榜",
                    },
                ],
            },
            {
                title: "云音乐韩语榜",
                data: [
                    {
                        id: "745956260",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "云音乐韩语榜",
                    },
                ],
            },
        ];
    },
    // 获取榜单详情
    async getTopListDetail(topListItem, page) {
        return fetch("https://v.iarc.top/playlist?type=playlist&id=" + topListItem.id)
            .then(res => res.json())
            .then(res => {
                return {
                    musicList: res.map(item => {
                        return {
                            // 媒体来源
                            platform: "Netease",
                            // 媒体ID
                            id: item.url.split("&id=")[1],
                            /** 作者 */
                            artist: item.artist,
                            /** 歌曲标题 */
                            title: item.name,

                            /** 默认音源 */
                            url: item.url,
                            /** 专辑封面图 */
                            artwork: item.pic,

                            /** 歌词URL */
                            lrc: item.lrc,
                        };
                    }),
                };
            })
    },
    // // 获取推荐歌单 tag
    // async getRecommendSheetTags() {
    //     // ...
    // },
    // // 获取某个 tag 下的所有歌单
    // async getRecommendSheetsByTag(tag, page) {
    //     // ...
    // },
}
