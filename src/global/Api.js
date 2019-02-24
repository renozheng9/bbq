import { api_path } from './Global';
// 获取验证码(POST)
export const api_code = api_path + '/identify';
// 手机号登录(POST)
export const api_login = api_path + '/login';
// 获取理工大首页信息(GET)
export const api_lgd_index = api_path + '/lgdindex';
// 模拟登录智慧理工大(POST)
export const api_lgd_login = api_path + '/lgdlogin';
// 获取版本信息并上传基本日志信息(GET)
export const api_index_init = api_path + '/index/init';
// 获取用户信息(GET)
export const api_user_read = api_path + '/user/read';
// 修改用户信息(PUT),需拼接id
export const api_user_update = api_path + '/user/';
// 获取用户关注主题的数量(GET)
export const api_subscription_theme_count = api_path + '/user/attentiontheme/count';
// 获取用户关注用户的数量(GET)
export const api_user_attention_count = api_path + '/user/attention/count';
// 获取用户被用户关注的数量(GET)
export const api_user_beattention_count = api_path + '/user/beattention/count';
// 获取用户关注的用户(GET)
export const api_user_attention_user = api_path + '/user/attention/user';
// 获取用户的粉丝(GET)
export const api_user_beattention_user = api_path + '/user/beattention/user';
// 检查用户昵称是否被占用(GET),需拼接id?nickname=xxx
export const api_check_nickname = api_path + '/user/checknickname/';
// 获取所有主题(GET)
export const api_theme_all = api_path + '/theme/all';
// 获取用户关注的主题(GET)
export const api_theme_attention_user = api_path + '/theme/attention/user';
// 获取主题被关注的数量(GET),需拼接id
export const api_theme_beattention_count = api_path + '/theme/beattention/count?id=';
// 发布动态(POST)
export const api_article = api_path + '/article/save';
// 更新动态(PUT),需拼接id
export const api_article_update = api_path + '/article/';
// 根据id获取某动态(GET)
export const api_id_article = api_path + '/article/info';
// 获取某主题下所有动态(GET)
export const api_theme_article = api_path + '/articles/theme';
// 获取某用户的动态(GET)
export const api_article_user = api_path + '/articles/user';
// 获取推荐动态(GET)
export const api_article_recommend = api_path + '/articles/recommend';
// 获取用户关注的主题和用户的动态(GET)
export const api_article_attention = api_path + '/articles/attention';
// 提交评论(POST)
export const api_comment_save = api_path + '/article_comment/save';
// 获取某动态的评论(GET)
export const api_article_comment = api_path + '/article_comment/read';
// 评论点赞(method: post)&评论取消点赞(method: delete)&获取评论是否点赞(method: get)
export const api_upvote_comment = api_path+ '/upvote/article_comment';
// 获取accessToken(GET)
export const api_accessToken = api_path + '/image/accesstoken';
// 点赞动态(method: post)&取消点赞动态(method: delete)&获取动态是否点赞(method: get)
export const api_upvote_article = api_path + '/upvote/article';
// 关注主题(method: post)&取消关注主题(method: delete)
export const api_attention_theme = api_path + '/attention/theme';
// 获取主题是否被某用户关注(GET),需拼接id
export const api_theme_beattention = api_path + '/attention/theme/';
// 关注用户(method: post)&取消关注用户(method: delete)
export const api_attention_user = api_path + '/attention/user';
// 获取用户是否被某用户关注(GET),需拼接id
export const api_user_beattention = api_path + '/attention/user/';
// 收藏动态(method: post)&取消收藏动态(method: delete)
export const api_collection_article = api_path + '/collection/article';
// 获取动态是否被某用户收藏(GET)
export const api_article_becollection = api_path + '/collection/article/bool';
// 获取用户收藏的动态(GET)
export const api_user_collection = api_path + '/collection/article';
// 获取反馈类型(GET)
export const api_feedback_type = api_path + '/feedback/type';
// 提交反馈(POST)
export const api_feedback_submit = api_path + '/feedback/submit';
// 举报(POST)
export const api_report = api_path + '/report';
// 搜索(GET)
export const api_search = api_path + '/search';
// 获取用户消息(GET)
export const api_advice_read = api_path + '/advice/read';
// 轮播图(GET)
export const api_slideimg = api_path + '/slideimg/getimgs';