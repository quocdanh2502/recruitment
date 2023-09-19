import recruiterApi from "api/recruiterApi";
import { call, fork, put, take, takeEvery } from "redux-saga/effects";
import { recruiterActions } from "./recruiterSlice";

import { getErrorMessage } from "utils";

function* handleGetPositions(actions) {
  try {
    const positions = yield call(recruiterApi.getPositions, actions.payload);
    yield put(recruiterActions.getPositionsSuccess(positions));
  } catch (error) {
    yield put(recruiterActions.getPositionsFailed());
  } finally {
    return;
  }
}

function* watchGetPositionsFlow() {
  while (true) {
    const actions = yield take(recruiterActions.getPositions().type);
    yield fork(handleGetPositions, actions);
  }
}

function* handleGetEvents(actions) {
  try {
    const events = yield call(recruiterApi.getEvents, actions.payload);
    yield put(recruiterActions.getEventsSuccess(events));
  } catch (error) {
    yield put(recruiterActions.getEventsFailed());
  } finally {
    return;
  }
}

function* watchGetEventsFlow() {
  while (true) {
    const actions = yield take(recruiterActions.getEvents().type);
    yield fork(handleGetEvents, actions);
  }
}

function* handleGetHistory(actions) {
  try {
    const history = yield call(recruiterApi.getHistory, actions.payload);
    yield put(recruiterActions.getHistorySuccess(history));
  } catch (error) {
    yield put(recruiterActions.getHistoryFailed());
  } finally {
    return;
  }
}

function* watchGetHistoryFlow() {
  while (true) {
    const actions = yield take(recruiterActions.getHistory().type);
    yield fork(handleGetHistory, actions);
  }
}
// -------------------------------------------------------

function* createInterviewSaga(actions) {
  try {
    yield put(recruiterActions.fetchLoading(true));
    const applyForm = yield call(recruiterApi.createInterview, actions.payload);
    yield put(recruiterActions.createInterviewSuccess(applyForm));
  } catch (err) {
    yield put(
      recruiterActions.fetchError(getErrorMessage(err.response.status))
    );
  } finally {
    yield put(recruiterActions.fetchLoading(false));
  }
}

function* watchCreateInterviewFlow() {
  yield takeEvery(
    recruiterActions.createInterviewRequest.toString(),
    createInterviewSaga
  );
}
// -------------------------------------------------------

function* updateInterviewSaga(actions) {
  try {
    yield put(recruiterActions.fetchLoading(true));
    const updateForm = yield call(
      recruiterApi.updateInterview,
      actions.payload.id,
      actions.payload.data
    );
    yield put(recruiterActions.updateInterviewSuccess(updateForm));
  } catch (err) {
    yield put(
      recruiterActions.fetchError(getErrorMessage(err.response.status))
    );
  } finally {
    yield put(recruiterActions.fetchLoading(false));
  }
}

function* watchUpdateInterviewFlow() {
  yield takeEvery(
    recruiterActions.updateInterviewRequest.toString(),
    updateInterviewSaga
  );
}
// -------------------------------------------------------

function* cancelInterviewSaga(actions) {
  try {
    yield put(recruiterActions.fetchLoading(true));
    const cancel = yield call(
      recruiterApi.cancelInterview,
      actions.payload.id,
      actions.payload.reId
    );
    yield put(recruiterActions.cancelInterviewSuccess(cancel));
  } catch (err) {
    yield put(
      recruiterActions.fetchError(getErrorMessage(err.response.status))
    );
  } finally {
    yield put(recruiterActions.fetchLoading(false));
  }
}

function* watchCancelInterviewFlow() {
  yield takeEvery(
    recruiterActions.cancelInterviewRequest.toString(),
    cancelInterviewSaga
  );
}
// -------------------------------------------------------

function* createCalendarSaga(actions) {
  try {
    yield put(recruiterActions.fetchLoading(true));
    const create = yield call(
      recruiterApi.getCreateCalendar,
      actions.payload.code,
      actions.payload.id
      );
    yield put(recruiterActions.createCalendarSuccess(create));
  } catch (err) {
    yield put(
      recruiterActions.fetchError(getErrorMessage(err.response.status))
    );
  } finally {
    yield put(recruiterActions.fetchLoading(false));
  }
}

function* watchCreateCalendarFlow() {
  yield takeEvery(
    recruiterActions.createCalendarRequest.toString(),
    createCalendarSaga
  );
}

export default function* recruiterSaga() {
  yield fork(watchGetPositionsFlow);
  yield fork(watchGetEventsFlow);
  yield fork(watchGetHistoryFlow);
  yield fork(watchCreateInterviewFlow);
  yield fork(watchUpdateInterviewFlow);
  yield fork(watchCancelInterviewFlow);
  yield fork(watchCreateCalendarFlow);
}
