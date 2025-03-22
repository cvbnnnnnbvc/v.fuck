let videoData = [];  // 存储原始视频数据
let filteredVideos = [];  // 存储筛选后的视频数据
let currentIndex = 0; // 当前显示的视频索引
const videosPerPage = 3; // 每页显示 3 条

// 页面加载时获取 JSON 数据
document.addEventListener("DOMContentLoaded", function () {
    fetch("videos.json")
        .then(response => response.json())
        .then(data => {
            videoData = data;
            filteredVideos = [...videoData]; // 初始时，全部数据可用
            currentIndex = 0;
            renderVideos(true);
        })
        .catch(error => console.error("加载 JSON 失败:", error));
});

// 渲染视频列表
function renderVideos(reset = false) {
    const container = document.getElementById("video-list");
    if (reset) {
        container.innerHTML = ""; // 只在搜索或初次加载时清空
        currentIndex = 0;
    }

    const videosToShow = filteredVideos.slice(currentIndex, currentIndex + videosPerPage);
    videosToShow.forEach(video => {
        const card = document.createElement("div");
        card.classList.add("video-card");

        card.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}" onclick="window.open('${video.link}', '_blank')">
            <h3><a href="${video.link}" target="_blank">${video.title}</a></h3>
            <p>${video.author}</p>
        `;

        container.appendChild(card);
    });

    currentIndex += videosToShow.length; // 更新索引

    // 控制 "查看更多" 按钮的显示
    const loadMoreBtn = document.getElementById("load-more");
    if (currentIndex < filteredVideos.length) {
        loadMoreBtn.style.display = "block";
    } else {
        loadMoreBtn.style.display = "none";
    }
}

// 搜索功能
function searchVideos() {
    const query = document.getElementById("search-input").value.trim();
    if (query === "") {
        filteredVideos = [...videoData]; // 为空时恢复所有视频
    } else {
        try {
            const regex = new RegExp(query, "i"); // 创建正则表达式，"i" 忽略大小写
            filteredVideos = videoData.filter(video => regex.test(video.title));
        } catch (error) {
            console.error("无效的正则表达式:", error);
            alert("搜索关键字格式错误，请检查后重试！");
            return;
        }
    }
    renderVideos(true);
}

// 加载更多视频
function loadMoreVideos() {
    renderVideos(false);
}
