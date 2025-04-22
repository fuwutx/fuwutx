module.exports = {
    platform: "Youtube",
    author: "fuwutx",
    version: "0.1.0",
    appVersion: ">0.0.0",
    cacheControl: "no-store",
    primaryKey: ["string"],
    srcUrl: "https://yilong.eu.org/api/musicfree_plugin/youtube.js",
    hints: {
        importMusicSheet: [
            "请输入id或url"
        ],
    },
    userVariables: [
        {
            key: "key",
            title: "Youtube API Key",
        }
    ],
    supportedSearchType: [],
    base: "https://www.googleapis.com/youtube/v3",
    // async search(query, page, type) {
    //     // 搜索的具体逻辑
    // },
    // 获取音乐的真实 url
    async getMediaSource(mediaItem, quality) {
        this.fetchSongPromise = fetch(`https://music.youtube.com/youtubei/v1/player?prettyPrint=false`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "context": {
                    "client": {
                        // "clientVersion": "1.20241002.01.01",
                        // "clientName": "WEB_REMIX"
                        "clientName": "IOS",
                        "clientVersion": "19.42.1",
                        "visitorData": "CgttM19LOU5nREFPdyiT9ZvABjIKCgJNWRIEGgAgVw%3D%3D"
                    }
                },
                "videoId": mediaItem.id,
            })
        });

        const response = await this.fetchSongPromise;
        const data = await response.json();
        const musicInfo = data.videoDetails;
        this.song = {
            platform: "Youtube",
            id: mediaItem.id,
            artist: musicInfo.author,
            title: musicInfo.title,
            artwork: `https://i.ytimg.com/vi/${mediaItem.id}/maxresdefault.jpg`,
            url: data.streamingData.adaptiveFormats.find(item => item.audioQuality === "AUDIO_QUALITY_MEDIUM").url,
        }
        return {
            "url": this.song.url,
        }
    },
    // 获取音乐详情
    async getMusicInfo(musicItem) {
        await this.fetchSongPromise;
        return this.song;
    },
    // 获取歌词
    // async getLyric(musicItem) {

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

    // },
    // // 导入歌单
    // async importMusicSheet(urlLike) {

    // },
    // 获取榜单列表
    async getTopLists() {
        const params = new URLSearchParams({
            part: 'snippet,contentDetails,id,status,localizations,player',
            channelId: 'UCvz5CzQNXqnHohbCUwYVhUg',
            maxResults: 50,
            key: env.getUserVariables().key
        });
        const response = await fetch(`${this.base}/playlists?${params}`);
        const data = await response.json();

        const recommend = ["OLAK5uy_ki2XOTeQSiKRKhgNayrXMHfO8tmpxP6kA", "PLV2TGHsmriLHSIrdtlJz2ZmBhLztH_mPY", "PLADr7aFJj-bpK0HT4m93gJt3OTXmaQYUY", "PLTmUcjrk732dFIn82WeGD5rj1Gn72LQxw", "PLIY33qKb4qluEfHy_YqvDhp9uyrvLaMhg", "PL1fdq2TC_ytk30Dg6rnj28wSlUx8BtNA", "PLvzBDqEsb6H31pcSJgqetyfWZanhH1Ccp", "PLVMo-E3wxVhhKhtbq_NdOP9wHerByqQXW", "PLeug_7XVoF2c3NM0gGlk3qfh92gFj5vZO", "PLHiaQMjh0jZzACdmV6SEqN8zG6_gmpYzB", "OLAK5uy_ndf2-8HZqnnND41h4vrp4o3sWi4-b4J9c", "OLAK5uy_nYCICwJgTLB1TmJTIJ_6v3DYCB5_XRBeI", "OLAK5uy_nUmhP1mxR-xB4NEhcqIiTPUpqgn3pyMCY", "OLAK5uy_nSrYEJKY3sF1eXmsInfQGcgUnQP7pECZ8", "PLUWA1f_Yu1nA9pXYF8SYA-BcCqguhgHmV", "OLAK5uy_mzXFXTUUrQeR9AA9Sn3AwmfplqISFM9f8", "OLAK5uy_lWFdmgRr0H6jkfjggQV0Gjg68A9CLmEvQ", "OLAK5uy_n3itTnxxC-q4nL56teBJDDRd7PWsDofdc", "OLAK5uy_kFQHTgbSWXTi1k5GcFd4uroeXdnQJaRhI", "RDCLAK5uy_k_5ZyDqYTN96AJje0xNB5z6H2ltZYnCDQ"]
        const recommendParams = new URLSearchParams({
            part: 'snippet,contentDetails,id,status,localizations,player',
            id: recommend.join(","),
            maxResults: 50,
            key: env.getUserVariables().key
        });
        const recommendResponse = await fetch(`${this.base}/playlists?${recommendParams}`);
        const recommendData = await recommendResponse.json();

        return [
            {
                title: "我的播放列表",
                data: data.items.map(item => {
                    return {
                        id: item.id,
                        description: item.snippet.description,
                        coverImg: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
                        title: item.snippet.title
                    }
                })
            },
            {
                title: "推荐列表",
                data: recommendData.items.map(item => {
                    return {
                        id: item.id,
                        description: item.snippet.description,
                        coverImg: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
                        title: item.snippet.title
                    }
                })
            }
        ]
    },
    // 获取榜单详情
    async getTopListDetail(topListItem, page) {
        const params = new URLSearchParams({
            part: 'snippet,contentDetails,id,status',
            playlistId: topListItem.id,
            maxResults: 50,
            pageToken: this.pageToken || "",
            key: env.getUserVariables().key
        });
        const response = await fetch(`${this.base}/playlistItems?${params}`);
        const data = await response.json();
        this.pageToken = data.nextPageToken;
        return {
            musicList: data.items.map(item => {
                return {
                    platform: "Youtube",
                    id: item.contentDetails.videoId,
                    // artist: "unknown",
                    title: item.snippet.title
                }
            }),
            isEnd: data.nextPageToken === undefined,
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
