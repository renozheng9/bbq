import { ip, version } from './Global';
// 获取验证码(POST)
export const api_code = 'http://' + ip + '/bbq/public/api/' + version + '/identify';
// 手机号登录(POST)
export const api_login = 'http://' + ip + '/bbq/public/api/' + version + '/login';
// 获取理工大首页信息(GET)
export const api_lgd_index = 'http://' + ip + '/bbq/public/api/' + version + '/lgdindex';
// 模拟登录智慧理工大(POST)
export const api_lgd_login = 'http://' + ip + '/bbq/public/api/' + version + '/lgdlogin';
// 获取用户信息(GET)
export const api_user_read = 'http://' + ip + '/bbq/public/api/' + version + '/user/read';
// 修改用户信息(PUT),需拼接id
export const api_user_update = 'http://' + ip + '/bbq/public/api/' + version + '/user/';
// 获取用户关注主题的数量(GET)
export const api_subscription_theme_count = 'http://' + ip + '/bbq/public/api/' + version + '/user/attentiontheme/count';
// 获取用户关注用户的数量(GET)
export const api_user_attention_count = 'http://' + ip + '/bbq/public/api/' + version + '/user/attention/count';
// 获取用户被用户关注的数量(GET)
export const api_user_beattention_count = 'http://' + ip + '/bbq/public/api/' + version + '/user/beattention/count';
// 获取用户关注的用户(GET)
export const api_user_attention_user = 'http://' + ip + '/bbq/public/api/' + version + '/user/attention/user';
// 获取用户的粉丝
export const api_user_beattention_user = 'http://' + ip + '/bbq/public/api/' + version + '/user/beattention/user';
// 检查用户昵称是否被占用(GET),需拼接id?nickname=xxx
export const api_check_nickname = 'http://' + ip + '/bbq/public/api/' + version + '/user/checknickname/';
// 获取所有主题(GET)
export const api_theme_all = 'http://' + ip + '/bbq/public/api/' + version + '/theme/all';
// 获取用户关注的主题(GET)
export const api_theme_attention_user = 'http://' + ip + '/bbq/public/api/' + version + '/theme/attention/user';
// 获取主题被关注的数量(GET),需拼接id
export const api_theme_beattention_count = 'http://' + ip + '/bbq/public/api/' + version + '/theme/beattention/count?id=';
// 发布动态(POST)
export const api_article = 'http://' + ip + '/bbq/public/api/' + version + '/article';
// 更新动态(PUT),需拼接id
export const api_article_update = 'http://' + ip + '/bbq/public/api/' + version + '/article/';
// 获取某主题下所有动态(GET)
export const api_theme_article = 'http://' + ip + '/bbq/public/api/' + version + '/articles/theme';
// 获取某用户的动态(GET)
export const api_article_user = 'http://' + ip +'/bbq/public/api/' + version + '/articles/user';
// 获取推荐动态(GET)
export const api_article_recommend = 'http://' + ip + '/bbq/public/api/' + version + '/articles/recommend';
// 获取用户关注的主题和用户的动态(GET)
export const api_article_attention = 'http://' + ip + '/bbq/public/api/' + version + '/articles/attention';
// 获取accessToken(GET)
export const api_accessToken = 'http://' + ip + '/bbq/public/api/' + version + '/image/accesstoken';
// 点赞(method: post)&取消点赞(method: delete)
export const api_upvote = 'http://' + ip + '/bbq/public/api/' + version + '/upvote';
// 获取是否被点赞(GET)
export const api_isUpvote = 'http://' + ip + '/bbq/public/api/' + version + '/upvote';
// 关注主题(method: post)&取消关注主题(method: delete)
export const api_attention_theme = 'http://' + ip + '/bbq/public/api/' + version + '/attention/theme';
// 获取主题是否被某用户关注(GET),需拼接id
export const api_theme_beattention = 'http://' + ip + '/bbq/public/api/' + version + '/attention/theme/';
// 关注用户(method: post)&取消关注用户(method: delete)
export const api_attention_user = 'http://' + ip + '/bbq/public/api/' + version + '/attention/user';
// 获取用户是否被某用户关注(GET),需拼接id
export const api_user_beattention = 'http://' + ip + '/bbq/public/api/' + version + '/attention/user/';
// 收藏动态(method: post)&取消收藏动态(method: delete)
export const api_collection_article = 'http://' + ip +'/bbq/public/api/' + version + '/collection/article';
// 获取动态是否被某用户收藏(GET)
export const api_article_becollection = 'http://' + ip +'/bbq/public/api/' + version + '/collection/article/bool';
// 获取用户收藏的动态
export const api_user_collection = 'http://' + ip + '/bbq/public/api/' + version + '/collection/article';
// 获取反馈类型(GET)
export const api_feedback_type = 'http://' + ip + '/bbq/public/api/' + version + '/feedback/type';
// 提交反馈(POST)
export const api_feedback_submit = 'http://' + ip + '/bbq/public/api/' + version + '/feedback/submit';
// 举报(POST)
export const api_report = 'http://' + ip + '/bbq/public/api/' + version + '/report';
// 搜索(GET)
export const api_search = 'http://' + ip + '/bbq/public/api/' + version + '/search';
// 轮播图(GET)
export const api_slideimg = 'http://' + ip + '/bbq/public/api/' + version + '/slideimg/getimgs';