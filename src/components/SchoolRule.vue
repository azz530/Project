<template>
  <div class="container">
    <div class="tips">
      <i class="iconfont icon-gonggao"></i>
      <span>校园公告</span>
    </div>
    <div class="line"></div>
    <div class="news">
      <div class="news_left">
        <div class="news_left_header">
          <p>左标题</p>
          <img src="../assets/img/avatar.jpg" alt="" />
        </div>
        <div class="news_left_content">
          <div class="news_left_content_items">
            <a href="#">啥时是啊hi是hi</a>
          </div>
        </div>
      </div>
      <div class="news_mid">
        <div class="news_mid_img">
          <img src="../assets/img/avatar.jpg" alt="" />
        </div>
        <div class="news_mid_important">
          <div class="news_mid_important_tips">
            <p class="left">-</p>
            <p>头条新闻</p>
            <p class="right">-</p>
          </div>
          <div class="news_mid_important_content">
            <div class="news_mid_important_content_title">
              <h2>这是头条新闻的标题</h2>
            </div>
            <div class="news_mid_important_content_article">
              <p>
                sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="news_right">
        <div class="news_right_header">
          <p>右标题</p>
          <img src="../assets/img/avatar.jpg" alt="" />
        </div>
        <div class="news_right_content">
          <div class="news_right_content_items">
            <a href="#">啥时是啊hi是hi</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.container {
  padding: 0;
  margin: 0;
  .tips {
    display: flex;
    align-items: center;
    i {
      font-size: 40px;
    }
    span {
      margin-left: 10px;
    }
  }
  .line {
    height: 2px;
    width: 1260px;
    background-color: rgb(143, 142, 142);
    margin-left: 40px;
  }
  .news {
    display: flex;
    margin-top: 20px;
    .news_left {
      flex: 3;
      .news_left_header {
        p {
          font-size: 24px;
          font-weight: 300;
          margin-bottom: 10px;
          padding: 0;
        }
        img {
          height: 200px;
          width: 98%;
        }
      }
      .news_left_content {
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid rgb(206, 206, 206);
        .news_left_content_items {
          margin: 15px 0;
          a {
            font-size: 24px;
            text-decoration: none;
            color: black;
            font-weight: 500;
          }
          a:hover {
            color: rgb(5, 101, 180);
          }
        }
      }
    }
    .news_mid {
      flex: 4;
      padding: 0 20px;
      .news_mid_img {
        padding: 0;
        margin: 0;
        img {
          height: 550px;
          width: 100%;
        }
      }
      .news_mid_important {
        .news_mid_important_tips {
          display: flex;
          justify-content: center;
          p {
            color: rgb(255, 0, 0);
          }
          .left {
            margin-right: 20px;
          }
          .right {
            margin-left: 20px;
          }
        }
        .news_mid_important_content {
          margin: 0;
          padding: 0;
          .news_mid_important_content_title {
            display: flex;
            justify-content: center;
            h2 {
              margin: 0;
              padding: 0;
              font-weight: 500;
            }
          }
          .news_mid_important_content_article {
            width: 600px;
            height: 200px;
            word-break: break-all;
            text-indent: 2em;
          }
        }
      }
    }
    .news_right {
      flex: 3;
      .news_right_header {
        p {
          font-size: 24px;
          font-weight: 300;
          margin-bottom: 10px;
          padding: 0;
        }
        img {
          height: 200px;
          width: 98%;
        }
      }
      .news_right_content {
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid rgb(206, 206, 206);
        .news_right_content_items {
          margin: 15px 0;
          a {
            font-size: 24px;
            text-decoration: none;
            color: black;
            font-weight: 500;
          }
          a:hover {
            color: rgb(5, 101, 180);
          }
        }
      }
    }
  }
}
</style>