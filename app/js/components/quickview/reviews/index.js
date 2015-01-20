'use strict';

var React = require('react');
var Reflux = require('reflux');
var _ = require('../../../utils/_');

var IconRating = require('../../shared/IconRating');
var UserReviews = require('./UserReviews');
var SubmitReview = require('./SubmitReview');
var EditReview = require('./EditReview');

var CurrentListingStore = require('../../../stores/CurrentListingStore');
var SystemStateMixin = require('../../../mixins/SystemStateMixin');
var ListingActions = require('../../../actions/ListingActions');

var ReviewsTab = React.createClass({

    mixins: [
        Reflux.listenTo(ListingActions.fetchReviewsCompleted, 'onFetchItemCommentsCompleted'),
        SystemStateMixin
    ],

    propTypes: {
        listing: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        return {
            reviews: CurrentListingStore.getReviews(),
            reviewBeingEdited: null,
            currentUserReview: {
                rate: 0,
                text: ''
            }
        };
    },

    componentWillReceiveProps: function (newProps) {
        if (this.props.listing.id !== newProps.listing.id) {
            ListingActions.fetchReviews(newProps.listing.id);
        }
    },

    componentWillMount: function () {
        // only fetch reviews if not found in store
        if (this.props.listing.id && !this.state.reviews) {
            ListingActions.fetchReviews(this.props.listing.id);
        }
    },

    render: function () {
        var { listing } = this.props;
        var { reviews, currentUserReview, reviewBeingEdited, currentUser } = this.state;

        /* jshint ignore:start */
        return (
            <div className="tab-pane active quickview-reviews row">
                <section className="col-md-3 col-left">
                    { this.renderReviewFilters() }
                </section>
                <section className={ (currentUserReview.id && !reviewBeingEdited) ? "col-md-9" : "col-md-5" }>
                    <UserReviews reviews={ reviews } onEdit={ this.onEdit }  user={ currentUser }/>
                </section>
                {
                    !currentUserReview.id &&
                        <section className="col-md-4 col-right">
                            <SubmitReview listing={ listing } review={ currentUserReview } />
                        </section>
                }
                {
                    reviewBeingEdited &&
                        <section className="col-md-4 col-right">
                            <EditReview
                                user={ currentUser }
                                listing={ listing }
                                review={ reviewBeingEdited }
                                onCancel={ this.onEditCancel } />
                        </section>
                }
            </div>
        );
        /* jshint ignore:end */
    },

    onEdit: function (review) {
        this.setState({ reviewBeingEdited: review });
    },

    onEditCancel: function () {
        this.setState({ reviewBeingEdited: null });
    },

    onFetchItemCommentsCompleted: function () {
        var reviews = CurrentListingStore.getReviews();
        var currentUserReview = _.find(reviews, { author: { username: this.state.currentUser.username }});
        var updates = {
            reviews: reviews,
            currentUserReview: currentUserReview || this.state.currentUserReview
        };
        // update reviewBeingEdited prop if editing
        if (this.state.reviewBeingEdited) {
            updates.reviewBeingEdited = _.find(reviews, { id: this.state.reviewBeingEdited.id });
        }
        this.setState(updates);
    },

    renderReviewFilters: function () {
        var listing = this.props.listing;
        var total = listing.totalVotes;

        /* jshint ignore:start */
        var starComponents = [5, 4, 3, 2, 1].map(function (star) {
            var count = listing['totalRate' + star];
            var width = total === 0 ? 0 : Math.round(count * 100 / total).toFixed(2);
            var style = {
                width: width + '%'
            };

            return (
                <div className="star-rating">
                    <a href="javascript:;">{ star } stars</a>
                    <div className="progress">
                        <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={style} ></div>
                    </div>
                    <span className="count">({ count || 0 })</span>
                </div>
            );
        });

        return (
            <div>
                <h5>Average Rating</h5>
                <IconRating currentRating = { listing.avgRate || 0 } viewOnly />
                <p> From { listing.totalVotes || 0 } ratings </p>
                <div className="review-filters">
                    { starComponents }
                </div>
            </div>
        );
        /* jshint ignore:end */
    }

});

module.exports = ReviewsTab;
