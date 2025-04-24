module.exports = {
    platform: "Netease",
    author: "fuwutx",
    version: "0.1.2",
    appVersion: ">0.0.0",
    cacheControl: "no-store",
    primaryKey: ["id"],
    srcUrl: "https://yilong.eu.org/api/musicfree_plugin/netease_sayqz.js",
    hints: {
        importMusicSheet: [
            "请输入id或url"
        ],
    },
    userVariables: [
    ],
    supportedSearchType: [],
    base: "https://api.sayqz.com/tunefree/ncmapi",
    // async search(query, page, type) {
    //     // 搜索的具体逻辑
    // },
    // 获取音乐的真实 url
    async getMediaSource(mediaItem, quality) {
        return fetch(this.base + "/song/url?id=" + mediaItem.id)
            .then(res => res.json())
            .then(res => {
                return {
                    url: res.data[0].url,
                };
            });
    },
    // 获取音乐详情
    async getMusicInfo(musicItem) {
        return fetch(this.base + "/song/detail?ids=" + musicItem.id)
            .then(res => res.json())
            .then(res => {
                let item = res.songs[0];
                return {
                    // 媒体来源
                    platform: "Netease",
                    // 媒体ID
                    id: item.id,
                    /** 作者 */
                    artist: item.ar.map(item => item.name).join(", "),
                    /** 歌曲标题 */
                    title: item.name,
                    /** 时长(s) */
                    duration: item.dt / 1000,
                    /** 专辑名 */
                    album: item.al.name,
                    /** 专辑封面图 */
                    artwork: item.al.picUrl,
                };
            })
    },
    // 获取歌词
    async getLyric(musicItem) {
        return fetch(this.base + "/lyric?id=" + musicItem.id)
            .then(res => res.json())
            .then(res => {
                return {
                    rawLrc: res.lrc.lyric,
                    translation: res.tlyric.lyric,
                }
            })
    },
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
    async importMusicItem(urlLike) {
        if (urlLike.startsWith("http")) {
            let id = urlLike.split("id=")[1];
            if (id) {
                urlLike = id;
            } else {
                return [];
            }
        }

        return fetch(this.base + "/song/detail?ids=" + urlLike)
            .then(res => res.json())
            .then(res => {
                let item = res.songs[0];
                return {
                    // 媒体来源
                    platform: "Netease",
                    // 媒体ID
                    id: item.id,
                    /** 作者 */
                    artist: item.ar.map(item => item.name).join(", "),
                    /** 歌曲标题 */
                    title: item.name,
                    /** 时长(s) */
                    duration: item.dt / 1000,
                    /** 专辑名 */
                    album: item.al.name,
                    /** 专辑封面图 */
                    artwork: item.al.picUrl,
                };
            })
    },
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
        
        return fetch(this.base + "/playlist/track/all?id=" + urlLike + "&limit=1000&offset=0")
            .then(res => res.json())
            .then(res => {
                return res.songs.map(item => {
                    return {
                        // 媒体来源
                        platform: "Netease",
                        // 媒体ID
                        id: item.id,
                        /** 作者 */
                        artist: item.ar.map(item => item.name).join(", "),
                        /** 歌曲标题 */
                        title: item.name,
                        /** 时长(s) */
                        duration: item.dt / 1000,
                        /** 专辑名 */
                        album: item.al.name,
                        /** 专辑封面图 */
                        artwork: item.al.picUrl,
                    };
                });
            })
    },
    // // 获取榜单列表
    async getTopLists() {
        return [
            {
                title: "我的",
                data: [
                    {
                        id: "9493075761",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "喜欢",
                    },
                    {
                        id: "12610418982",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "推荐",
                    },
                ],
            },
            {
                title: "榜单",
                data: [
                    {
                        id: "5059644681",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "云音乐日语榜",
                    },
                    {
                        id: "745956260",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "云音乐韩语榜",
                    },
                ],
            },
            {
                title: "雷达",
                data: [
                    {
                        id: "3136952023",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "私人雷达",
                    },
                    {
                        id: "2829896389",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "日系私人雷达",
                    },
                    {
                        id: "2829920189",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "韩系私人雷达",
                    },
                ],
            },
        ];
    },
    // // 获取榜单详情
    async getTopListDetail(topListItem, page) {
        return fetch(this.base + "/playlist/track/all?id=" + topListItem.id + "&limit=100&offset=" + (page - 1) * 100)
            .then(res => res.json())
            .then(res => {
                return {
                    musicList: res.songs.map(item => {
                        return {
                            // 媒体来源
                            platform: "Netease",
                            // 媒体ID
                            id: item.id,
                            /** 作者 */
                            artist: item.ar.map(item => item.name).join(", "),
                            /** 歌曲标题 */
                            title: item.name,
                            /** 时长(s) */
                            duration: item.dt / 1000,
                            /** 专辑名 */
                            album: item.al.name,
                            /** 专辑封面图 */
                            artwork: item.al.picUrl,
                        };
                    }),
                    isEnd: res.songs.length < 100,
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
