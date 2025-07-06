module.exports = {
    platform: "Netease",
    author: "fuwutx",
    version: "0.1.5",
    appVersion: ">0.0.0",
    cacheControl: "no-store",
    primaryKey: ["id"],
    // srcUrl: "",
    hints: {
        importMusicSheet: [
            "请输入id或url"
        ],
    },
    userVariables: [],
    supportedSearchType: [],
    base: "https://api.toubiec.cn/api/music_v1.php",
    // async search(query, page, type) {
    //     // 搜索的具体逻辑
    // },
    // 获取音乐的真实 url
    async getMediaSource(mediaItem, quality) {
        const data = await fetchData("song_url_v1", { ids: "[" + mediaItem.id + "]" });
        return {
            url: data.data[0].url || "https://v.iarc.top/?server=netease&type=url&id=" + mediaItem.id,
        };
    },
    // 获取音乐详情
    async getMusicInfo(musicItem) {
        const res = await fetchData("song_detail", { c: '[{"id": ' + musicItem.id + '}]' }); // Netease API
        const song = res.songs[0];
        if (!res.songs.name) {
            this.song = musicItem; // If no song found, return the original musicItem
            return musicItem;
        }
        this.song = {
            platform: "Netease",
            id: musicItem.id,
            artist: song.ar.map(artist => artist.name).join("/"),
            title: song.name,
            duration: song.dt / 1000, // Convert milliseconds to seconds
            album: song.al.name,
            artwork: song.al.picUrl,
            url: "https://v.iarc.top/?server=netease&type=url&id=" + musicItem.id, // Use the same URL fetching logic
            // rawLrc: song.lrc ? song.lrc.lyric : "",
            // rawtLrc: song.tlyric ? song.tlyric.lyric : "",
            alia: song.alia.join(", ") || "",
        }
        return this.song;
    },
    // 获取歌词
    async getLyric(musicItem) {
        const res = await fetchData("lyric", { id: musicItem.id });
        return {
            rawLrc: res.lrc ? res.lrc.lyric : "",
            translation: res.tlyric ? res.tlyric.lyric : "",
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
        const uid = 9408732870; // Netease user ID
        const playlist = (await fetchData("user_playlists", { uid })).playlist;
        return [{
            title: "我的歌单",
            data: playlist.filter(item => item.userId === uid).map(item => {
                return {
                    id: item.id,
                    description: item.description,
                    coverImg: item.coverImgUrl,
                    title: item.name,
                };
            })
        },
        {
            title: "官方歌单",
            data: playlist.filter(item => item.specialType === 100).map(item => {
                return {
                    id: item.id,
                    description: item.description,
                    coverImg: item.coverImgUrl,
                    title: item.name,
                };
            })
        },
        {
            title: "其他歌单",
            data: playlist.filter(item => item.specialType === 0 && item.userId !== uid).map(item => {
                return {
                    id: item.id,
                    description: item.description,
                    coverImg: item.coverImgUrl,
                    title: item.name,
                };
            })
        },
        {
            title: "云端歌单",
            data: [{
                id: "cloud",
                description: "",
                coverImg: "",
                title: "云端",
            },
            {
                id: "daily",
                description: "",
                coverImg: "",
                title: "每日推荐",
            }]
        }]
    },
    // 获取榜单详情
    async getTopListDetail(topListItem, page) {
        if (topListItem.id === "cloud") {
            const cloudData = await fetchData("cloud");
            console.log("size:", cloudData.maxSize / 1024 / 1024, cloudData.size / 1024 / 1024);
            return {
                musicList: cloudData.data.map(song => {
                    const simpleSong = song.simpleSong || song;
                    return {
                        platform: "Netease",
                        id: song.songId,
                        artist: song.simpleSong.ar.map(artist => artist.name).join("/") || song.artist,
                        title: song.simpleSong.name || song.fileName,
                        album: song.simpleSong.al.name || song.album,
                        artwork: song.simpleSong.al.picUrl || ""
                    };
                }),
            };
        } else if (topListItem.id === "daily") {
            const dailyData = await fetchData("recommend_songs");
            return {
                musicList: dailyData.data.dailySongs.map(song => {
                    return {
                        platform: "Netease",
                        id: song.id,
                        artist: song.ar.map(artist => artist.name).join("/"),
                        title: song.name,
                        album: song.al.name,
                        artwork: song.al.picUrl,
                    };
                }),
            };
        }

        let res;
        res = await fetchData("playlist_track_all", { id: topListItem.id, limit: 1000 });
        const trackIds = res.playlist.trackIds;
        const offset = 0;
        const limit = 1000;
        const c = '[' + trackIds.slice(offset, offset + limit).map((item) => '{"id":' + item.id + '}').join(',') + ']';
        res = await fetchData("song_detail", { c });
        return {
            musicList: res.songs.map(song => {
                return {
                    platform: "Netease",
                    id: song.id,
                    artist: song.ar.map(artist => artist.name).join("/"),
                    title: song.name,
                    album: song.al.name,
                    artwork: song.al.picUrl,
                };
            }),
        };
    },
    // // 获取推荐歌单 tag
    // async getRecommendSheetTags() {
    //     // ...
    // },
    // // 获取某个 tag 下的所有歌单
    // async getRecommendSheetsByTag(tag, page) {
    //     // ...
    // },
};
