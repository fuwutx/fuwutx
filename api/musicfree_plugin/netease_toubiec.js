module.exports = {
    platform: "Netease",
    author: "fuwutx",
    version: "0.1.5",
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
    base: "https://api.toubiec.cn/api/music_v1.php",
    token: "aaadf4c03a188ccd7ad887a5bedabbd6",
    bearer: "58e19ffb63ce9e247b152941c3513b8d",
    // async search(query, page, type) {
    //     // 搜索的具体逻辑
    // },
    // 获取音乐的真实 url
    async getMediaSource(mediaItem, quality) {
        let level = "standard";
        switch (quality) {
            case "super":
                level = "lossless";
                break;
            case "high":
                level = "exhigh";
                break;
            case "low":
                level = "standard";
                break;
            case "standard":
                level = "standard";
                break;
        }


        this.fetchSongPromise = fetch(this.base, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.bearer}`,
            },
            body: JSON.stringify({
                level,
                token: this.token,
                type: "song",
                url: "https://music.163.com/#/song?id=" + mediaItem.id,
            }),
        })
        const res = await this.fetchSongPromise;
        const data = await res.json();

        this.song = {
            platform: "Netease",
            id: mediaItem.id,
            artist: data.song_info.artist,
            title: data.song_info.name,
            duration: data.url_info.interval,
            album: data.song_info.album,
            artwork: data.song_info.cover,
            url: data.url_info.url,
            rawLrc: data.lrc.lyric,

            rawtLrc: data.lrc.tlyric,
            alia: data.song_info.alia
        }

        return {
            url: this.song.url,
        }
    },
    // 获取音乐详情
    async getMusicInfo(musicItem) {
        if (!this.song || this.song.id !== musicItem.id) {
            this.fetchSongPromise = fetch(this.base, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.bearer}`,
                },
                body: JSON.stringify({
                    level: "lossless",
                    token: this.token,
                    type: "song",
                    url: "https://music.163.com/#/song?id=" + musicItem.id,
                }),
            })
            const res = await this.fetchSongPromise;
            const data = await res.json();

            this.song = {
                platform: "Netease",
                id: musicItem.id,
                artist: data.song_info.artist,
                title: data.song_info.name,
                duration: data.url_info.interval,
                album: data.song_info.album,
                artwork: data.song_info.cover,
                url: data.url_info.url,
                rawLrc: data.lrc.lyric,

                rawtLrc: data.lrc.tlyric,
                alia: data.song_info.alia
            }

            await this.fetchSongPromise;
        }

        return this.song;
    },
    // 获取歌词
    async getLyric(musicItem) {
        // delay for 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.fetchSongPromise;
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            rawLrc: this.song.rawLrc,
            translation: this.song.rawtLrc,
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
    // async importMusicItem(urlLike) {
    //     // ...
    // },
    // 导入歌单
    // async importMusicSheet(urlLike) {
    //     // ...
    // },
    // 获取榜单列表
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
    // 获取榜单详情
    async getTopListDetail(topListItem, page) {
        const res = await fetch(this.base, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.bearer}`,
            },
            body: JSON.stringify({
                token: this.token,
                type: "playlist",
                url: "https://music.163.com/#/playlist?id=" + topListItem.id,
            }),
        })
        const data = await res.json();
        return {
            musicList: data.data.map(item => {
                return {
                    platform: "Netease",
                    id: item.id,
                    artist: item.artist,
                    title: item.name,
                    album: item.album,
                    artwork: item.cover
                };
            }),
        }
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
