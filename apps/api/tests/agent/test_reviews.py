import pytest

from dataagent.agent.reviews import review_requested


@pytest.mark.parametrize(
    "question",
    [
        "Prepare a monthly business review",
        "Give me a performance overview",
        "How are we doing this month?",
        "How we did in december 2025?",
        "How did we perform last month?",
    ],
)
def test_reviews_receive_the_report_contract(question: str) -> None:
    assert review_requested(question)


@pytest.mark.parametrize(
    "question", ["How many orders?", "How are you doing?", "Show sales by day"]
)
def test_narrow_questions_do_not_require_an_entire_review(question: str) -> None:
    assert not review_requested(question)
