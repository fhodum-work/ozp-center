'use strict';

var React = require('react');
var { Link, Navigation, CurrentPath } = require('react-router');
var ActiveState = require('../../mixins/ActiveStateMixin');
var _ = require('../../utils/_');
var IconRating = require('../shared/IconRating.jsx');
var LaunchLink = require('../LaunchLink.jsx');

var BookmarkButton = require('../BookmarkButton.jsx');

var ListingTile = React.createClass({

    mixins: [Navigation, CurrentPath, ActiveState],

    statics: {
        fromArray: function (array) {
            return array.map((listing) => <ListingTile listing={listing} key={listing.id}/>);
        }
    },

    render: function () {
        var listing = this.props.listing;

        var name = listing.title;
        var description = listing.descriptionShort && listing.descriptionShort.substr(0, 140);
        var launchUrl = listing.launchUrl;
        var imageLargeUrl = listing.imageLargeUrl;
        var totalVotes = listing.totalVotes;
        var avgRate = listing.avgRate;
        var agencyShort = listing.agencyShort;
        var href = this.makeHref(this.getActiveRoutePath(), null, {
            listing: listing.id,
            action: 'view',
            tab: 'overview'
        });

        return this.transferPropsTo(
            <li className="listing SearchListingTile" key={listing.id} >
                <a className="listing-link"  href={ href }>
                    {/* Empty link - css will make it cover entire <li>*/}
                </a>
                <img src={ imageLargeUrl } />
                <section className="slide-up">
                    <p className="title">{ name }</p>
                    <IconRating
                        className="icon-rating"
                        viewOnly
                        currentRating = { avgRate }
                        toggledClassName="fa fa-star"
                        untoggledClassName="fa fa-star-o"
                        halfClassName="fa fa-star-half-o" />
                    {
                        agencyShort &&
                            <span className="company">{ agencyShort }</span>
                    }
                    <p className="description">{ description }</p>
                    { this.renderActions() }
                </section>
            </li>
        );
    },

    renderActions: function () {
        return (
            <div className="btn-group actions">
                {/* can't nest anchor tags, using button here with onClick listener */}
                <LaunchLink className="btn-default" listing={this.props.listing} />
                <BookmarkButton listing={this.props.listing} />
            </div>
        );
    }
});

module.exports = ListingTile;
