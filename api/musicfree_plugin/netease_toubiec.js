
module.exports = {
    platform: "Netease",
    author: "fuwutx",
    version: "0.1.2",
    appVersion: ">0.0.0",
    cacheControl: "no-store",
    primaryKey: ["id"],
    srcUrl: "https://yilong.eu.org/api/musicfree_plugin/netease_toubiec.js",
    hints: {
        importMusicSheet: [
            "请输入id或url"
        ],
    },
    userVariables: [],
    supportedSearchType: [],
    base: "https://v.iarc.top/",
    // async search(query, page, type) {
    //     // 搜索的具体逻辑
    // },
    // 获取音乐的真实 url
    async getMediaSource(mediaItem, quality) {
        const token = "58e19ffb63ce9e247b152941c3513b8d"

        this.fetchSongPromise = fetch("https://api.toubiec.cn/api/music_v1.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                level: "lossless",
                token: "aaadf4c03a188ccd7ad887a5bedabbd6",
                type: "song",
                url: "https://music.163.com/#/song?id=" + mediaItem.id,
            }),
        })
            .then(res => res.json())
            .then(res => {
                this.song = {
                    id: mediaItem.id,
                    url: res.url_info.url,
                    name: res.song_info.name,
                    artist: res.song_info.artist,
                    cover: res.song_info.cover,
                    lrc: res.lrc.lyric,
                    yrc: res.yrc.lyric,
                    tlrc: res.lrc.tlyric
                }
            })

        await this.fetchSongPromise;
        return {
            url: this.song.url,
        }
    },
    // 获取音乐详情
    async getMusicInfo(musicItem) {
        if (!this.song) {
            const token = "58e19ffb63ce9e247b152941c3513b8d";

            this.fetchSongPromise = fetch("https://api.toubiec.cn/api/music_v1.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    level: "lossless",
                    token: "aaadf4c03a188ccd7ad887a5bedabbd6",
                    type: "song",
                    url: "https://music.163.com/#/song?id=" + musicItem.id,
                }),
            })
                .then(res => res.json())
                .then(res => {
                    this.song = {
                        id: musicItem.id,
                        url: res.url_info.url,
                        name: res.song_info.name,
                        artist: res.song_info.artist,
                        cover: res.song_info.cover,
                        lrc: res.lrc.lyric,
                        yrc: res.yrc.lyric,
                        tlrc: res.lrc.tlyric
                    }
                })

            await this.fetchSongPromise;
        }

        return {
            // 媒体来源
            platform: "Netease",
            // 媒体ID
            id: this.song.id,
            /** 作者 */
            artist: this.song.artist,
            /** 歌曲标题 */
            title: this.song.name,

            /** 默认音源 */
            url: this.song.url,
            /** 专辑封面图 */
            artwork: this.song.cover,

            /** 歌词URL */
            lrc: this.song.lrc,
        };
    },
    // 获取歌词
    async getLyric(musicItem) {
        // delay for 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.fetchSongPromise;
        return {
            rawLrc: this.song.lrc,
            translation: this.song.tlrc,
        }
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

        return fetch(this.base + "?type=song&id=" + urlLike)
            .then(res => res.json())
            .then(res => {
                return {
                    // 媒体来源
                    platform: "Netease",
                    // 媒体ID
                    id: urlLike,
                    /** 作者 */
                    artist: res[0].artist,
                    /** 歌曲标题 */
                    title: res[0].name,

                    /** 默认音源 */
                    url: res[0].url,
                    /** 专辑封面图 */
                    artwork: res[0].pic,

                    /** 歌词URL */
                    lrc: res[0].lrc,
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

        return fetch(this.base + "?type=playlist&id=" + urlLike)
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
                title: "喜欢",
                data: [
                    {
                        id: "9493075761",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "喜欢",
                    },
                ],
            },
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
                title: "私人雷达",
                data: [
                    {
                        id: "3136952023",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "私人雷达",
                    },
                ],
            },
            {
                title: "日系私人雷达",
                data: [
                    {
                        id: "2829896389",
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
                        id: "5059644681",
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
        return fetch(this.base + "?type=playlist&id=" + topListItem.id)
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
                            // url: item.url,
                            /** 专辑封面图 */
                            // artwork: item.pic,

                            /** 歌词URL */
                            // lrc: item.lrc,
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
