module.exports = {
    platform: "Youtube",
    author: "fuwutx",
    version: "0.1.0",
    appVersion: ">0.0.0",
    cacheControl: "no-store",
    primaryKey: ["string"],
    srcUrl: "https://yilong.eu.org/api/musicfree_plugin/youtube_bearer.js",
    hints: {
        importMusicSheet: [
            "请输入id或url"
        ],
    },
    userVariables: [
        {
            key: "clientId",
            title: "Youtube Client ID",
        },
        {
            key: "clientSecret",
            title: "Youtube Client Secret",
        },
        {
            key: "refreshToken",
            title: "Youtube Refresh Token",
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
            artwork: `https://i.ytimg.com/vi/${mediaItem.id}/maxresdefault.jpg` || `https://i.ytimg.com/vi/${mediaItem.id}/default.jpg`,
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
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: env.getUserVariables().clientId,
                client_secret: env.getUserVariables().clientSecret,
                refresh_token: env.getUserVariables().refreshToken,
                grant_type: 'refresh_token'
            }).toString()
        });
        const token = await tokenResponse.json();

        const params = new URLSearchParams({
            part: 'snippet,contentDetails,id,status,localizations,player',
            channelId: 'UCvz5CzQNXqnHohbCUwYVhUg',
            maxResults: 50,
            // key: env.getUserVariables().key
        }).toString();
        const response = await fetch(`${this.base}/playlists?${params}`, {
            headers: {
                "Authorization": `Bearer ${token.access_token}`
            }
        });
        const data = await response.json();

        const recommend = ["OLAK5uy_ki2XOTeQSiKRKhgNayrXMHfO8tmpxP6kA", "PLV2TGHsmriLHSIrdtlJz2ZmBhLztH_mPY", "PLADr7aFJj-bpK0HT4m93gJt3OTXmaQYUY", "PLTmUcjrk732dFIn82WeGD5rj1Gn72LQxw", "PLIY33qKb4qluEfHy_YqvDhp9uyrvLaMhg", "PL1fdq2TC_ytk30Dg6rnj28wSlUx8BtNA", "PLvzBDqEsb6H31pcSJgqetyfWZanhH1Ccp", "PLVMo-E3wxVhhKhtbq_NdOP9wHerByqQXW", "PLeug_7XVoF2c3NM0gGlk3qfh92gFj5vZO", "PLHiaQMjh0jZzACdmV6SEqN8zG6_gmpYzB", "OLAK5uy_ndf2-8HZqnnND41h4vrp4o3sWi4-b4J9c", "OLAK5uy_nYCICwJgTLB1TmJTIJ_6v3DYCB5_XRBeI", "OLAK5uy_nUmhP1mxR-xB4NEhcqIiTPUpqgn3pyMCY", "OLAK5uy_nSrYEJKY3sF1eXmsInfQGcgUnQP7pECZ8", "PLUWA1f_Yu1nA9pXYF8SYA-BcCqguhgHmV", "OLAK5uy_mzXFXTUUrQeR9AA9Sn3AwmfplqISFM9f8", "OLAK5uy_lWFdmgRr0H6jkfjggQV0Gjg68A9CLmEvQ", "OLAK5uy_n3itTnxxC-q4nL56teBJDDRd7PWsDofdc", "OLAK5uy_kFQHTgbSWXTi1k5GcFd4uroeXdnQJaRhI", "RDCLAK5uy_k_5ZyDqYTN96AJje0xNB5z6H2ltZYnCDQ", "PL1fdq2TC_ytk30Dg6rnj2L8wSlUx8BtNA", "PLXfux7uIW1PoIKRQ77ANPEmoPWV9JyMRR", "PLLw55L8z38RK4EbD8UXDeZcK22j_vt7SI", "PLLw55L8z38RK0NbxkuTgXiwBSvbTvpU_Q"]
        const recommendParams = new URLSearchParams({
            part: 'snippet,contentDetails,id,status,localizations,player',
            id: recommend.join(","),
            maxResults: 50,
            // key: env.getUserVariables().key
        });
        const recommendResponse = await fetch(`${this.base}/playlists?${recommendParams}`, {
            headers: {
                "Authorization": `Bearer ${token.access_token}`
            }
        });
        const recommendData = await recommendResponse.json();

        return [
            {
                title: "官方播放列表",
                data: [
                    {
                        id: "LL",
                        description: "喜欢的",
                        coverImg: "https://i.ytimg.com/vi/xxx/maxresdefault.jpg",
                        title: "喜欢的"
                    }
                ]
            },
            {
                title: "我的播放列表",
                data: data.items.map(item => {
                    return {
                        id: item.id,
                        description: item.snippet.description,
                        coverImg: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.default?.url,
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
                        coverImg: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.default?.url,
                        title: item.snippet.title
                    }
                })
            }
        ]
    },
    // 获取榜单详情
    async getTopListDetail(topListItem, page) {
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: env.getUserVariables().clientId,
                client_secret: env.getUserVariables().clientSecret,
                refresh_token: env.getUserVariables().refreshToken,
                grant_type: 'refresh_token'
            }).toString()
        });
        const token = await tokenResponse.json();

        const params = new URLSearchParams({
            part: 'snippet,contentDetails,id,status',
            playlistId: topListItem.id,
            maxResults: 50,
            pageToken: page !== 1 ? this.pageToken : "",
            // key: env.getUserVariables().key
        });
        const response = await fetch(`${this.base}/playlistItems?${params}`, {
            headers: {
                "Authorization": `Bearer ${token.access_token}`
            }
        });
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
