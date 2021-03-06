import React, {
	Component
} from 'react';
import ReactDOM from 'react-dom';
import {
	Route
} from 'react-router-dom';
import axios from 'axios';
import notify from 'assets/ning-ui/js/notify'

import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import Home from 'pages/home/home';
import NingUI from 'pages/ning-ui/ning-ui';
import ArticleList from 'pages/article-list/article-list'
import ArticleDetail from 'pages/article-detail/article-detail'
import Demos from 'pages/demos/demos'
import PseudoDemos from 'pages/demos-pseudo/demos-pseudo'

import Aside from 'components/Aside/Aside';
import Container from 'components/Container/Container';
import ning_ui from 'assets/ning-ui/js/ning-ui'

import util from 'assets/ning-ui/js/utils.js';
import server from 'server/server.js'



class IndexHtml extends Component {
	constructor(props) {
		super(props)
		this.state = {
			nav_active_item: this.props.location.pathname,
            user_name: window.user_name,
            show_return_top: false,
		}
	}

	render() {
		return (
			<div>
				<Header
					nav_active_item={this.state.nav_active_item}
					user_name={this.state.user_name}
					logOut={this.logOut}
				/>
				<div className="common-container">
					<Route path="/index/home" component={Home}/>
	            	<Route path="/index/ning-ui" component={NingUI}/>
	            	<Route path="/index/article-list" component={ArticleList}/>
	            	<Route path="/index/article-detail/:id" component={ArticleDetail}/>
                    <Route path="/index/demos" component={Demos}/>
                    <Route path="/index/pseudo-demos" component={PseudoDemos}/>
				</div>
	            <Footer/>
        		<button className={ this.state.show_return_top ? 'return-top active' : 'return-top'} onClick={() => this.returnTop()}>返回顶部</button>
		    </div>
		);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			nav_active_item: nextProps.location.pathname,
		});
	}

	componentDidMount() {
		let self = this;
        ning_ui.init();
		Math.easeout = function(A, B, rate, callback) {
            if (A == B || typeof A != 'number') {
                return;
            }
            B = B || 0;
            rate = rate || 5;

            var step = function() {
                A = A + (B - A) / rate;

                if (A < 1) {
                    callback(B, true);
                    return;
                }
                callback(A, false);
                requestAnimationFrame(step);
            };
            step();
        };
        window.onscroll = function(e) {
            var doc = document.body.scrollTop ? document.body : document.documentElement;
            let show_return_top = (doc.scrollTop - doc.clientHeight) > 0;
            if (self.state.show_return_top !== show_return_top) {
                self.setState({
                    show_return_top,
                })
            }
        }
    }

    // 滚动到顶部缓动实现
    // rate表示缓动速率，默认是5
    // author: https://www.zhangxinxu.com
    returnTop = (rate) => {
        var doc = document.body.scrollTop ? document.body : document.documentElement;
        Math.easeout(doc.scrollTop, 0, rate, function(value) {
            doc.scrollTop = value;
        });
    }

    logOut = () => {
        let self = this,
            cb = res => {
                notify.success(res.message);
                self.setState({
                    user_name: null,
                }, () => {
                    window.user_name = undefined;
                })
            }
    	util.axiosFn(server.logOut, {}, 'post', cb);
    }
}

export default IndexHtml;