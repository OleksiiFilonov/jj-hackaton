'use strict';

angular.module('jj.2_signup', ['ngRoute'])

    .controller('signupCtrl', function ($scope, $log, UserService, SessionService) {
        Webcam.set({
            width: 320,
            height: 240,
            dest_width: 640,
            dest_height: 480,
            image_format: 'jpeg',
            jpeg_quality: 90
        });
        Webcam.attach('#my_camera');

        $scope.take_snapshot = function () {
            Webcam.snap(function (photo_base64) {
                $scope.photo_base64 = photo_base64;
                UserService.signin(photo_base64, function (data) {
                    $log.debug(data);

                    var faceDetails = data.faceInfo.FaceDetails[0];
                    $scope.data = faceDetails;
                    $scope.user = {age: faceDetails.AgeRange.Low, gender: faceDetails.Gender.Value};

                })
            });
        };

        $scope.save = function(user) {
            UserService.signup(user.name, $scope.photo_base64, function (data) {
                $log.debug(data);
                $scope.data = data
                var face = data.faceInfo.FaceDetails[0]

                SessionService.put(user.name, {
                    name: user.name,
                    photo: $scope.photo_base64,
                    age: face.AgeRange,
                    gender: face.Gender,
                    emotions: face.Emotions,
                    beard: face.Beard
                })
            })
        };


    });
